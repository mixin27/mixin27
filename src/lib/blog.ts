import { BlogPost, BlogCategory } from '@/types/blog';
import { getMDXBySlug, getAllMDX, compileMDXContent } from './mdx';

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllMDX('blog');

  return allPosts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title || '',
    description: post.metadata.description || '',
    content: post.content,
    coverImage: post.metadata.coverImage,
    date: post.metadata.date || new Date().toISOString(),
    lastModified: post.metadata.lastModified,
    author: post.metadata.author || {
      name: 'Kyaw Zayar Tun',
      avatar: '/images/avatar.jpg',
    },
    category: post.metadata.category || 'tutorial',
    tags: post.metadata.tags || [],
    readingTime: post.readingTime || '5 min read',
    featured: post.metadata.featured || false,
    published: post.metadata.published !== false,
    series: post.metadata.series,
  }));
}

/**
 * Get published blog posts only
 */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.published);
}

/**
 * Get blog posts sorted by date
 */
export async function getSortedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getPublishedBlogPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getSortedBlogPosts();
  return posts.filter((post) => post.featured);
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const mdxContent = await getMDXBySlug('blog', slug, 'index.mdx');

  if (!mdxContent) {
    // Try without nested folder
    const altContent = await getMDXBySlug('blog', slug);
    if (!altContent) return null;

    return {
      slug: altContent.slug,
      title: altContent.metadata.title || '',
      description: altContent.metadata.description || '',
      content: altContent.content,
      coverImage: altContent.metadata.coverImage,
      date: altContent.metadata.date || new Date().toISOString(),
      lastModified: altContent.metadata.lastModified,
      author: altContent.metadata.author || {
        name: 'Kyaw Zayar Tun',
        avatar: '/images/avatar.jpg',
      },
      category: altContent.metadata.category || 'tutorial',
      tags: altContent.metadata.tags || [],
      readingTime: altContent.readingTime || '5 min read',
      featured: altContent.metadata.featured || false,
      published: altContent.metadata.published !== false,
      series: altContent.metadata.series,
    };
  }

  return {
    slug: mdxContent.slug,
    title: mdxContent.metadata.title || '',
    description: mdxContent.metadata.description || '',
    content: mdxContent.content,
    coverImage: mdxContent.metadata.coverImage,
    date: mdxContent.metadata.date || new Date().toISOString(),
    lastModified: mdxContent.metadata.lastModified,
    author: mdxContent.metadata.author || {
      name: 'Kyaw Zayar Tun',
      avatar: '/images/avatar.jpg',
    },
    category: mdxContent.metadata.category || 'tutorial',
    tags: mdxContent.metadata.tags || [],
    readingTime: mdxContent.readingTime || '5 min read',
    featured: mdxContent.metadata.featured || false,
    published: mdxContent.metadata.published !== false,
    series: mdxContent.metadata.series,
  };
}

/**
 * Get compiled blog post with React content
 */
export async function getCompiledBlogPost(slug: string) {
  const post = await getBlogPostBySlug(slug);
  if (!post) return null;

  const compiled = await compileMDXContent(post.content, post);

  return {
    ...post,
    content: compiled.content,
  };
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: BlogCategory): Promise<BlogPost[]> {
  const posts = await getSortedBlogPosts();
  return posts.filter((post) => post.category === category);
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getSortedBlogPosts();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllBlogTags(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get all unique categories
 */
export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  const posts = await getPublishedBlogPosts();
  const categoriesSet = new Set<BlogCategory>();

  posts.forEach((post) => {
    categoriesSet.add(post.category);
  });

  return Array.from(categoriesSet);
}

/**
 * Get related blog posts
 */
export async function getRelatedBlogPosts(
  slug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const currentPost = await getBlogPostBySlug(slug);
  if (!currentPost) return [];

  const allPosts = await getSortedBlogPosts();

  // Calculate relevance score based on shared tags and category
  const postsWithScore = allPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      let score = 0;

      // Same category: +3 points
      if (post.category === currentPost.category) {
        score += 3;
      }

      // Shared tags: +1 point each
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );
      score += sharedTags.length;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return postsWithScore.slice(0, limit).map((item) => item.post);
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getSortedBlogPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get blog statistics
 */
export async function getBlogStats() {
  const posts = await getPublishedBlogPosts();
  const tags = await getAllBlogTags();
  const categories = await getAllBlogCategories();

  return {
    totalPosts: posts.length,
    totalTags: tags.length,
    totalCategories: categories.length,
    featuredPosts: posts.filter((p) => p.featured).length,
    postsByCategory: categories.reduce((acc, category) => {
      acc[category] = posts.filter((p) => p.category === category).length;
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Get posts in a series
 */
export async function getSeriesPosts(seriesName: string): Promise<BlogPost[]> {
  const posts = await getSortedBlogPosts();
  return posts
    .filter((post) => post.series?.name === seriesName)
    .sort((a, b) => (a.series?.order || 0) - (b.series?.order || 0));
}
