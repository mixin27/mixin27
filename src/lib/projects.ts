import { Project, ProjectCategory } from '@/types/project';
import { getMDXBySlug, getAllMDX, compileMDXContent } from './mdx';

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  const allProjects = await getAllMDX('projects');

  return allProjects.map((project) => ({
    slug: project.slug,
    title: project.metadata.title || '',
    description: project.metadata.description || '',
    longDescription: project.metadata.longDescription,
    image: project.metadata.image || '/projects/placeholder.jpg',
    images: project.metadata.images || [],
    category: project.metadata.category || 'mobile',
    tags: project.metadata.tags || [],
    technologies: project.metadata.technologies || [],
    platform: project.metadata.platform || 'Flutter',
    status: project.metadata.status || 'completed',
    featured: project.metadata.featured || false,
    links: project.metadata.links || {},
    date: project.metadata.date || new Date().toISOString(),
    client: project.metadata.client,
    role: project.metadata.role,
    duration: project.metadata.duration,
    teamSize: project.metadata.teamSize,
    highlights: project.metadata.highlights || [],
    challenges: project.metadata.challenges || [],
    learnings: project.metadata.learnings || [],
  }));
}

/**
 * Get projects sorted by date
 */
export async function getSortedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getSortedProjects();
  return projects.filter((project) => project.featured);
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const mdxContent = await getMDXBySlug('projects', slug, 'index.mdx');

  if (!mdxContent) {
    const altContent = await getMDXBySlug('projects', slug);
    if (!altContent) return null;

    return {
      slug: altContent.slug,
      title: altContent.metadata.title || '',
      description: altContent.metadata.description || '',
      longDescription: altContent.metadata.longDescription,
      image: altContent.metadata.image || '/projects/placeholder.jpg',
      images: altContent.metadata.images || [],
      category: altContent.metadata.category || 'mobile',
      tags: altContent.metadata.tags || [],
      technologies: altContent.metadata.technologies || [],
      platform: altContent.metadata.platform || 'Flutter',
      status: altContent.metadata.status || 'completed',
      featured: altContent.metadata.featured || false,
      links: altContent.metadata.links || {},
      date: altContent.metadata.date || new Date().toISOString(),
      client: altContent.metadata.client,
      role: altContent.metadata.role,
      duration: altContent.metadata.duration,
      teamSize: altContent.metadata.teamSize,
      highlights: altContent.metadata.highlights || [],
      challenges: altContent.metadata.challenges || [],
      learnings: altContent.metadata.learnings || [],
    };
  }

  return {
    slug: mdxContent.slug,
    title: mdxContent.metadata.title || '',
    description: mdxContent.metadata.description || '',
    longDescription: mdxContent.metadata.longDescription,
    image: mdxContent.metadata.image || '/projects/placeholder.jpg',
    images: mdxContent.metadata.images || [],
    category: mdxContent.metadata.category || 'mobile',
    tags: mdxContent.metadata.tags || [],
    technologies: mdxContent.metadata.technologies || [],
    platform: mdxContent.metadata.platform || 'Flutter',
    status: mdxContent.metadata.status || 'completed',
    featured: mdxContent.metadata.featured || false,
    links: mdxContent.metadata.links || {},
    date: mdxContent.metadata.date || new Date().toISOString(),
    client: mdxContent.metadata.client,
    role: mdxContent.metadata.role,
    duration: mdxContent.metadata.duration,
    teamSize: mdxContent.metadata.teamSize,
    highlights: mdxContent.metadata.highlights || [],
    challenges: mdxContent.metadata.challenges || [],
    learnings: mdxContent.metadata.learnings || [],
  };
}

/**
 * Get compiled project with content
 */
export async function getCompiledProject(slug: string) {
  const project = await getProjectBySlug(slug);
  if (!project) return null;

  const mdxContent = await getMDXBySlug('projects', slug);
  if (!mdxContent) return project;

  const compiled = await compileMDXContent(mdxContent.content, project);

  return {
    ...project,
    content: compiled.content,
  };
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const projects = await getSortedProjects();
  return projects.filter((project) => project.category === category);
}

/**
 * Get projects by tag
 */
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const projects = await getSortedProjects();
  return projects.filter((project) =>
    project.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get projects by technology
 */
export async function getProjectsByTechnology(tech: string): Promise<Project[]> {
  const projects = await getSortedProjects();
  return projects.filter((project) =>
    project.technologies.some((t) => t.toLowerCase() === tech.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export async function getAllProjectTags(): Promise<string[]> {
  const projects = await getAllProjects();
  const tagsSet = new Set<string>();

  projects.forEach((project) => {
    project.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get all unique technologies
 */
export async function getAllTechnologies(): Promise<string[]> {
  const projects = await getAllProjects();
  const techSet = new Set<string>();

  projects.forEach((project) => {
    project.technologies.forEach((tech) => techSet.add(tech));
  });

  return Array.from(techSet).sort();
}

/**
 * Get all unique categories
 */
export async function getAllProjectCategories(): Promise<ProjectCategory[]> {
  const projects = await getAllProjects();
  const categoriesSet = new Set<ProjectCategory>();

  projects.forEach((project) => {
    categoriesSet.add(project.category);
  });

  return Array.from(categoriesSet);
}

/**
 * Get related projects
 */
export async function getRelatedProjects(
  slug: string,
  limit: number = 3
): Promise<Project[]> {
  const currentProject = await getProjectBySlug(slug);
  if (!currentProject) return [];

  const allProjects = await getSortedProjects();

  const projectsWithScore = allProjects
    .filter((project) => project.slug !== slug)
    .map((project) => {
      let score = 0;

      // Same category: +3 points
      if (project.category === currentProject.category) {
        score += 3;
      }

      // Same platform: +2 points
      if (project.platform === currentProject.platform) {
        score += 2;
      }

      // Shared tags: +1 point each
      const sharedTags = project.tags.filter((tag) =>
        currentProject.tags.includes(tag)
      );
      score += sharedTags.length;

      // Shared technologies: +1 point each
      const sharedTech = project.technologies.filter((tech) =>
        currentProject.technologies.includes(tech)
      );
      score += sharedTech.length;

      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return projectsWithScore.slice(0, limit).map((item) => item.project);
}

/**
 * Search projects
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const projects = await getSortedProjects();
  const lowerQuery = query.toLowerCase();

  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get project statistics
 */
export async function getProjectStats() {
  const projects = await getAllProjects();
  const tags = await getAllProjectTags();
  const technologies = await getAllTechnologies();
  const categories = await getAllProjectCategories();

  return {
    totalProjects: projects.length,
    totalTags: tags.length,
    totalTechnologies: technologies.length,
    totalCategories: categories.length,
    featuredProjects: projects.filter((p) => p.featured).length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    inProgressProjects: projects.filter((p) => p.status === 'in-progress').length,
    projectsByCategory: categories.reduce((acc, category) => {
      acc[category] = projects.filter((p) => p.category === category).length;
      return acc;
    }, {} as Record<string, number>),
  };
}
