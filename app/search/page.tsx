'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface SearchResult {
  title: string
  content: string[]
  relatedsearch: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('query') || ''
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (!initialQuery) return

    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)

      const messages = [
        'Fetching top articles...',
        'Extracting news...',
        'Summarizing...'
      ]

      let messageIndex = 0
      setLoadingMessage(messages[messageIndex])

      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length
        setLoadingMessage(messages[messageIndex])
      }, 2000)

      try {
        const response = await fetch(`http://localhost:8080/search?query=${encodeURIComponent(initialQuery)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        const data: SearchResult = await response.json()
        setResult(data)
      } catch (err) {
        setError('An error occurred while fetching results. Please try again.')
      } finally {
        clearInterval(messageInterval)
        setLoading(false)
        setLoadingMessage('')
      }
    }

    fetchSearchResults()
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleRelatedSearch = (term: string) => {
    setQuery(term)
    router.push(`/search?query=${encodeURIComponent(term)}`)
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 px-4 sm:px-6 overflow-x-hidden">
      {/* Header with Search */}
      <header className="pt-16 pb-8">
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="mb-6">
            <div className={`inline-flex flex-wrap items-center border-b ${isFocused ? 'border-white' : 'border-gray-800'} pb-1 transition-colors duration-200`}>
              <span className="text-lg sm:text-xl font-normal text-gray-300">Summarized news on "</span>
              <input
                ref={titleInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-transparent text-lg sm:text-xl font-normal text-white focus:outline-none w-auto max-w-full"
                style={{ width: `${Math.max(1, query.length)}ch` }}
                aria-label="Search query"
              />
              <span className="text-lg sm:text-xl font-normal text-gray-300">"</span>
            </div>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {loading && (
            <div className="flex flex-col items-center py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse text-sm sm:text-base">{loadingMessage}</p>
            </div>
          )}

          {error && (
            <div className="border border-gray-800 rounded-lg p-4 sm:p-6 text-center">
              <p className="text-gray-400 text-sm sm:text-base">{error}</p>
              <Button 
                className="mt-4 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
                onClick={handleSearch}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && !result && initialQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm sm:text-base">No results found for "{initialQuery}".</p>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-light text-white mb-4 sm:mb-8">{result.title}</h2>
              
              {result.content.map((paragraph, index) => (
                <p key={index} className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}

              {result.relatedsearch.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-800">
                  <h3 className="text-base sm:text-lg font-light text-white mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedsearch.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-gray-300 hover:text-white border border-gray-700 bg-gray-900 hover:bg-gray-800 rounded-full text-xs sm:text-sm"
                        onClick={() => handleRelatedSearch(term)}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
