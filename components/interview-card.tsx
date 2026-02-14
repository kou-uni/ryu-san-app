'use client'

import type { Interview } from '@/lib/types'

interface InterviewCardProps {
  interview: Interview
  onClick: (interview: Interview) => void
}

export function InterviewCard({ interview, onClick }: InterviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div
      onClick={() => onClick(interview)}
      className="p-4 border border-border rounded-lg bg-card hover:shadow-md hover:border-primary transition-all cursor-pointer"
    >
      <div className="space-y-2">
        {/* Date */}
        <p className="text-xs text-muted-foreground">
          {formatDate(interview.interview_date)}
        </p>

        {/* Interviewee Name */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {interview.interviewee_name}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {interview.summary}
        </p>
      </div>

      {/* Click to read more indicator */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-primary font-medium">クリックして詳細を表示</p>
      </div>
    </div>
  )
}
