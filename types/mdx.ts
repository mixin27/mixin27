export interface Frontmatter {
  title: string
  description?: string
  date?: string
  updatedAt?: string
  author?: string
  tags?: string[]
  image?: string
  draft?: boolean
  category?: string
  tech?: string[]
  github?: string
  live?: string
  demo?: string
  playStore?: string
  appStore?: string
  pubDev?: string
  releases?: string
  status?: "completed" | "in-progress" | "archived"
  lastReviewed?: string
  version?: string
}
