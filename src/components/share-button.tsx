'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  description: string
  url?: string
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url: url || window.location.href,
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error)
          }
        })
    } else {
      // Fallback: copy to clipboard
      const shareUrl = url || window.location.href
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!')
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
    >
      <Share2 className="size-4" />
      Share
    </button>
  )
}
