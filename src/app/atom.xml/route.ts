import { getSortedBlogPosts } from '@/lib/blog'
import { getBaseUrl } from '@/lib/utils'

export async function GET() {
  const baseUrl = getBaseUrl()
  const posts = await getSortedBlogPosts()

  const atomEntries = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const updated = new Date(post.lastModified || post.date).toISOString()
      const published = new Date(post.date).toISOString()

      return `
  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${postUrl}" />
    <id>${postUrl}</id>
    <updated>${updated}</updated>
    <published>${published}</published>
    <summary><![CDATA[${post.description}]]></summary>
    <author>
      <name>Kyaw Zayar Tun</name>
      <email>kyawzayartun.contact@gmail.com</email>
    </author>
    ${post.tags.map((tag) => `<category term="${tag}" />`).join('\n    ')}
    ${post.coverImage ? `<link rel="enclosure" href="${baseUrl}${post.coverImage}" type="image/jpeg" />` : ''}
  </entry>`
    })
    .join('')

  const atomFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Kyaw Zayar Tun - Blog</title>
  <link href="${baseUrl}/blog" />
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${baseUrl}/blog</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>Articles and tutorials about mobile development, best practices, and my learnings.</subtitle>
  <author>
    <name>Kyaw Zayar Tun</name>
    <email>kyawzayartun.contact@gmail.com</email>
  </author>
  <rights>Copyright ${new Date().getFullYear()} Kyaw Zayar Tun</rights>
  ${atomEntries}
</feed>`

  return new Response(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
