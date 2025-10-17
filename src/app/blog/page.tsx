import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { generateMetadata as genMeta, formatDate } from '@/lib/utils'
import {
  getSortedBlogPosts,
  getFeaturedBlogPosts,
  getAllBlogCategories,
} from '@/lib/blog'

export const metadata: Metadata = genMeta({
  title: 'Blog',
  description:
    'Articles and tutorials about mobile development, best practices, and my learnings.',
  url: '/blog',
})

export default async function BlogPage() {
  const allPosts = await getSortedBlogPosts()
  const featuredPosts = await getFeaturedBlogPosts()
  const categories = await getAllBlogCategories()

  const recentPosts = allPosts.filter((p) => !p.featured).slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Thoughts, tutorials, and insights on mobile development, best
              practices, and lessons learned along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-8">Featured Posts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Featured Image Placeholder */}
                <div className="aspect-[2/1] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary/10">
                      {post.coverImage && (
                        <Image src={post.coverImage} alt={post.title} fill />
                      )}
                      {!post.coverImage && post.title.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-4" />
                      {formatDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-4" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-muted-foreground mb-4">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Read More
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="border-t bg-muted/20">
        <div className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            {/* Category Filter - You can make this interactive later */}
            <div className="hidden md:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Post Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-primary/10">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-3">
                    {post.category}
                  </span>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Get notified when I publish new articles about mobile development,
              tutorials, and industry insights.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Note: Newsletter functionality is not yet implemented.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
