import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import {
  getBlogPostBySlug,
  getCompiledBlogPost,
  getSortedBlogPosts,
  getRelatedBlogPosts,
} from '@/lib/blog'
import { formatDate } from '@/lib/utils'
import { ShareButton } from '@/components/share-button'
import { generateOGMetadata } from '@/lib/og'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getSortedBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return generateOGMetadata({
    title: post.title,
    description: post.description,
    url: `/blog/${slug}`,
    image: post.coverImage,
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const slug = (await params).slug
  const post = await getCompiledBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedBlogPosts(slug, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      <article className="container py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            {/* Category Badge */}
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-6">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {post.author.name.charAt(0)}
                </div>
                <span className="font-medium text-foreground">
                  {post.author.name}
                </span>
              </div>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" />
                {formatDate(post.date)}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" />
                {post.readingTime}
              </span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <Tag className="size-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm hover:bg-muted/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-muted">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Series Navigation */}
          {post.series && (
            <div className="rounded-lg border bg-card p-4 mb-8">
              <p className="text-sm text-muted-foreground mb-1">
                Part {post.series.order} of
              </p>
              <p className="font-semibold">{post.series.name}</p>
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
            {/* <MDXRemote source={post.content} components={mdxComponents} /> */}
            {post.content}
          </div>

          {/* Share Section */}
          <div className="border-t pt-8 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Share this article:</span>
              <ShareButton title={post.title} description={post.description} />
            </div>
          </div>

          {/* Author Bio */}
          <div className="rounded-lg border bg-card p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold mb-1">About {post.author.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {post.author.bio ||
                    'Passionate mobile developer sharing insights and tutorials.'}
                </p>
                {post.author.social && (
                  <div className="flex gap-3">
                    {post.author.social.github && (
                      <a
                        href={post.author.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {post.author.social.twitter && (
                      <a
                        href={post.author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a
                        href={post.author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-4xl font-bold text-primary/10">
                      {!post.coverImage && post.title.charAt(0)}
                      {post.coverImage && (
                        <Image
                          className="aspect-video"
                          src={post.coverImage}
                          alt={post.title}
                          width={320}
                          height={320}
                          objectFit="cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
