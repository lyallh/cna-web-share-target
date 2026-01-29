'use server'

import { auth } from '@clerk/nextjs/server'
import { redis } from '@/lib/redis'
import type { ShareData, ShareDataWithId } from '@/types/share'

const SHARE_KEY_PREFIX = 'share:'

/**
 * Saves share data to Redis KV store with auto-generated ID
 * Associates data with authenticated user
 * @returns The ID of the saved entry, or null on error
 */
export async function saveShareData(
  shareData: ShareData
): Promise<string | null> {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.error('User not authenticated')
      return null
    }

    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const key = `${SHARE_KEY_PREFIX}${userId}:${id}`

    await redis.hset(key, {
      id,
      userId,
      ...shareData,
    })

    return id
  } catch (error) {
    console.error('Failed to save share data:', error)
    return null
  }
}

/**
 * Retrieves stored share events for authenticated user from Redis, sorted by timestamp (newest first)
 */
export async function getShareHistory(): Promise<ShareDataWithId[]> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return []
    }

    // NB: The keys() command performs an O(n) scan of the entire keyspace and blocks the Redis server.
    // TODO: Consider SCAN or sorted set in production.
    const keys = await redis.keys(`${SHARE_KEY_PREFIX}${userId}:*`)

    if (!keys || keys.length === 0) {
      return []
    }

    const entries = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.hgetall(key)
        return data as unknown as ShareDataWithId
      })
    )

    return entries
      .filter(
        (entry): entry is ShareDataWithId =>
          entry !== null && typeof entry === 'object'
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
  } catch (error) {
    console.error('Failed to fetch share history:', error)
    return []
  }
}
