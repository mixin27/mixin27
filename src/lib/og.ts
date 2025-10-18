import { SITE_CONFIG } from './constants'
import { getBaseUrl } from './utils'

export type OGImageType = 'default' | 'blog' | 'project'

interface OGImageOptions {
  title: string
  description?: string
  type?: OGImageType
}

/**
 * Generate OG image URL for dynamic images
 */
export function getOGImageUrl({
  title,
  description,
  type = 'default',
}: OGImageOptions): string {
  const baseUrl = getBaseUrl()
  const params = new URLSearchParams()

  params.set('title', title)
  if (description) {
    params.set('description', description)
  }
  params.set('type', type)

  return `${baseUrl}/api/og?${params.toString()}`
}

/**
 * Generate metadata with OG image
 */
export function generateOGMetadata({
  title,
  description,
  type = 'default',
  url,
  image,
}: OGImageOptions & { url?: string; image?: string }) {
  const baseUrl = getBaseUrl()
  const ogImage = image || getOGImageUrl({ title, description, type })
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@kyawzayartun98',
    },
  }
}
