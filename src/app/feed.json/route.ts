import { getSortedBlogPosts } from '@/lib/blog'
import { getBaseUrl } from '@/lib/utils'

export async function GET() {
  const baseUrl = getBaseUrl()
  const posts = await getSortedBlogPosts()

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Kyaw Zayar Tun - Blog',
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/feed.json`,
    description:
      'Articles and tutorials about mobile development, best practices, and my learnings.',
    icon: `${baseUrl}/images/avatar.png`,
    favicon: `${baseUrl}/favicon.ico`,
    language: 'en',
    authors: [
      {
        name: 'Kyaw Zayar Tun',
        url: baseUrl,
        avatar: `${baseUrl}/images/avatar.png`,
      },
    ],
    items: posts.map((post) => ({
      id: `${baseUrl}/blog/${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.description,
      summary: post.description,
      image: post.coverImage ? `${baseUrl}${post.coverImage}` : undefined,
      date_published: new Date(post.date).toISOString(),
      date_modified: post.lastModified
        ? new Date(post.lastModified).toISOString()
        : new Date(post.date).toISOString(),
      authors: [
        {
          name: post.author.name,
          avatar: post.author.avatar,
        },
      ],
      tags: post.tags,
    })),
  }

  return Response.json(jsonFeed, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
