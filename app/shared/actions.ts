'use server'

import { redis } from '@/lib/redis'
import type { ShareData, ShareDataWithId } from '@/types/share'

const SHARE_KEY_PREFIX = 'share:'

/**
 * Saves share data to Redis KV store with auto-generated ID
 * @returns The ID of the saved entry, or null on error
 */
export async function saveShareData(shareData: ShareData): Promise<string | null> {
  try {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const key = `${SHARE_KEY_PREFIX}${id}`

    await redis.hset(key, {
      id,
      ...shareData,
    })

    return id
  } catch (error) {
    console.error('Failed to save share data:', error)
    return null
  }
}

/**
 * Retrieves all stored share events from Redis, sorted by timestamp (newest first)
 */
export async function getShareHistory(): Promise<ShareDataWithId[]> {
  try {
    const keys = await redis.keys(`${SHARE_KEY_PREFIX}*`)

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
      .filter((entry): entry is ShareDataWithId => entry !== null && typeof entry === 'object')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error('Failed to fetch share history:', error)
    return []
  }
}
