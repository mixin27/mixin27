import { getSortedProjects } from '@/lib/projects'
import { getBaseUrl } from '@/lib/utils'

export async function GET() {
  const baseUrl = getBaseUrl()
  const projects = await getSortedProjects()

  const sitemapEntries = projects
    .map((project) => {
      const lastMod = new Date(project.date).toISOString()
      const projectUrl = `${baseUrl}/projects/${project.slug}`

      return `
  <url>
    <loc>${projectUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    ${project.image ? `<image:image><image:loc>${baseUrl}${project.image}</image:loc></image:image>` : ''}
  </url>`
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>${sitemapEntries}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
