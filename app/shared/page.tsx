'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { saveShareData, getShareHistory } from './actions'
import type { ShareData, ShareDataWithId } from '@/types/share'

function SharePageContent() {
  const searchParams = useSearchParams()
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [history, setHistory] = useState<ShareDataWithId[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(function loadHistoryFromServer() {
    getShareHistory()
      .then(setHistory)
      .catch((error) => {
        console.error('Failed to load share history:', error)
      })
      .finally(() => {
        setIsLoadingHistory(false)
      })
  }, [])

  useEffect(function initializeShareDataFromLocalStorage() {
    const stored = localStorage.getItem('latestShareData')
    if (stored) {
      try {
        setShareData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored share data:', e)
      }
    }
  }, [])

  useEffect(
    function updateShareDataFromSearchParams() {
      const title = searchParams.get('title') || ''
      const text = searchParams.get('text') || ''
      const url = searchParams.get('url') || ''
      const error = searchParams.get('error')

      if (!title && !text && !url && !error) {
        return
      }

      let newShareData: ShareData

      if (error) {
        newShareData = {
          title: '',
          text: 'Error receiving shared data',
          url: '',
          timestamp: new Date().toISOString(),
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }
      } else {
        newShareData = {
          title,
          text,
          url,
          timestamp: new Date().toISOString(),
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
        }
      }

      localStorage.setItem('latestShareData', JSON.stringify(newShareData))
      setShareData(newShareData)
    },
    [searchParams]
  )

  async function handleSaveToHistory() {
    if (!shareData) return

    setIsSaving(true)
    try {
      const id = await saveShareData(shareData)
      if (id) {
        const updatedHistory = await getShareHistory()
        setHistory(updatedHistory)
      }
    } catch (error) {
      console.error('Failed to save share data:', error)
    } finally {
      setIsSaving(false)
    }
  }

  function handleHistoryItemClick(item: ShareDataWithId) {
    setShareData(item)
    localStorage.setItem('latestShareData', JSON.stringify(item))
  }

  if (!shareData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <div className="flex w-full flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Received Shared Data
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            All information received from the share operation
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="space-y-6 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-900">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                Title
              </h2>
              <div className="min-h-[3rem] rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <p className="whitespace-pre-wrap break-words text-black dark:text-zinc-50">
                  {shareData.title || (
                    <span className="italic text-zinc-400 dark:text-zinc-600">
                      (empty)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                Text
              </h2>
              <div className="min-h-[6rem] rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                <p className="whitespace-pre-wrap break-words text-black dark:text-zinc-50">
                  {shareData.text || (
                    <span className="italic text-zinc-400 dark:text-zinc-600">
                      (empty)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                URL
              </h2>
              <div className="min-h-[3rem] rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
                {shareData.url ? (
                  <a
                    href={shareData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {shareData.url}
                  </a>
                ) : (
                  <span className="italic text-zinc-400 dark:text-zinc-600">
                    (empty)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              Metadata
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                  Timestamp:{' '}
                </span>
                <span className="text-black dark:text-zinc-50">
                  {new Date(shareData.timestamp).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                  User Agent:{' '}
                </span>
                <span className="break-all text-black dark:text-zinc-50">
                  {shareData.userAgent}
                </span>
              </div>
              <div>
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                  Referrer:{' '}
                </span>
                <span className="break-all text-black dark:text-zinc-50">
                  {shareData.referrer || (
                    <span className="italic text-zinc-400 dark:text-zinc-600">
                      (none)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveToHistory}
            disabled={isSaving}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-zinc-700"
          >
            {isSaving ? 'Saving...' : 'Save to History'}
          </button>

          {history.length > 0 && (
            <div className="space-y-4 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                History
              </h2>
              {isLoadingHistory ? (
                <div className="text-center text-zinc-600 dark:text-zinc-400">
                  Loading history...
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryItemClick(item)}
                      className="w-full rounded-md border border-zinc-200 bg-white p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-900"
                    >
                      <div className="font-semibold text-black dark:text-zinc-50">
                        {item.title || (
                          <span className="italic text-zinc-400 dark:text-zinc-600">
                            (no title)
                          </span>
                        )}
                      </div>
                      {item.text && (
                        <div className="mt-1 italic text-sm text-zinc-700 line-clamp-2 dark:text-zinc-300">
                          {item.text}
                        </div>
                      )}
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="w-full text-center">
            <Link
              href="/"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  )
}
