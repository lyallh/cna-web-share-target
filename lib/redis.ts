import { Redis } from '@upstash/redis'

/**
 * Upstash Redis client singleton
 * Uses REST API credentials from environment variables
 */
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})
