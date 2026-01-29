export interface ShareData {
  title: string
  text: string
  url: string
  timestamp: string
  userAgent: string
  referrer: string
}

export interface ShareDataWithId extends ShareData {
  id: string
  userId: string
}
