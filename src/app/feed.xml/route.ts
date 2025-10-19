import { getSortedBlogPosts } from '@/lib/blog'
import { getBaseUrl } from '@/lib/utils'

export async function GET() {
  const baseUrl = getBaseUrl()
  const posts = await getSortedBlogPosts()

  const rssItems = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>kyawzayartun.contact@gmail.com (Kyaw Zayar Tun)</author>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
      ${post.coverImage ? `<enclosure url="${baseUrl}${post.coverImage}" type="image/*" />` : ''}
    </item>`
    })
    .join('')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kyaw Zayar Tun - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Articles and tutorials about mobile development, best practices, and my learnings.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>Copyright ${new Date().getFullYear()} Kyaw Zayar Tun</copyright>
    <managingEditor>kyawzayartun.contact@gmail.com (Kyaw Zayar Tun)</managingEditor>
    <webMaster>kyawzayartun.contact@gmail.com (Kyaw Zayar Tun)</webMaster>
    <image>
      <url>${baseUrl}/images/avatar.png</url>
      <title>Kyaw Zayar Tun</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
