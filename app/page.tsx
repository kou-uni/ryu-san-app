'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { InterviewForm } from '@/components/interview-form'
import { InterviewCard } from '@/components/interview-card'
import { InterviewDetailModal } from '@/components/interview-detail-modal'
import type { Interview } from '@/lib/types'

type View = 'list' | 'form'

export default function Page() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  )
  const [view, setView] = useState<View>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch interviews
  const fetchInterviews = async (keyword?: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const url = new URL('/api/interviews', window.location.origin)
      if (keyword) {
        url.searchParams.set('keyword', keyword)
      }
      console.log('Fetching interviews from:', url.toString())
      const response = await fetch(url.toString())
      console.log('Response status:', response.status, response.statusText)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to fetch interviews'
        console.error('API error:', errorMsg, data)
        setError(errorMsg)
        setInterviews([])
        return
      }

      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data)
        setError('Invalid response format from server')
        setInterviews([])
        return
      }

      console.log('Successfully fetched', data.length, 'interviews')
      setInterviews(data)
    } catch (err) {
      console.error('Error fetching interviews:', err)
      const errorMsg = err instanceof Error ? err.message : 'Error connecting to database'
      setError(errorMsg)
      setInterviews([])
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchInterviews()
  }, [])

  // Handle search
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    if (keyword.trim()) {
      fetchInterviews(keyword)
    } else {
      fetchInterviews()
    }
  }

  // Handle new interview
  const handleInterviewCreated = (newInterview: Interview) => {
    setInterviews((prev) => [newInterview, ...prev])
    setView('list')
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/interviews/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      setInterviews((prev) => prev.filter((i) => i.id !== id))
      setSelectedInterview(null)
    } catch (error) {
      console.error('Error deleting interview:', error)
      throw error
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                長崎県茂木取材記録
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                地元の魅力的なコンテンツを取材・記録
              </p>
            </div>
            <Button
              onClick={() => setView(view === 'list' ? 'form' : 'list')}
              className="whitespace-nowrap"
            >
              {view === 'list' ? '新規作成' : '一覧に戻る'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {view === 'form' ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <InterviewForm
            onSuccess={handleInterviewCreated}
            onCancel={() => setView('list')}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="font-medium">エラーが発生しました</p>
              <p className="text-sm mt-1">{error}</p>
              {error.includes('Database not configured') && (
                <p className="text-sm mt-2 text-red-600">
                  DATABASE_URL環境変数が設定されていません。Vercelのプロジェクト設定で設定してください。
                </p>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="キーワードで検索（取材相手名、内容など）..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Results Info */}
          {searchKeyword && (
            <div className="mb-6 text-sm text-muted-foreground">
              "{searchKeyword}" の検索結果: {interviews.length} 件
            </div>
          )}

          {/* Interview Cards Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchKeyword
                  ? `"${searchKeyword}" に該当する取材がありません`
                  : '取材がまだ登録されていません'}
              </p>
              {!searchKeyword && (
                <Button
                  onClick={() => setView('form')}
                  className="mt-4"
                >
                  最初の取材を記録
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={setSelectedInterview}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}
