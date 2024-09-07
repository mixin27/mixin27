import { Project } from "@/interfaces/project";
import { join } from "path";
import { getDirectory, getFileContent, getFileNames } from "./file";
import { getAllItems } from "./helpers";
import { markdownToHtml } from "./md";

/**
 * Projects directory
 */
const __PROJECT_DIR__ = getDirectory("/content/projects");

/**
 * Get project file names from /content/projects/
 * @returns List of file name under the Projects directory.
 */
const getProjectsFileNames = (): string[] => getFileNames(__PROJECT_DIR__);

/**
 * Get list slug from file names.
 * @returns List of `slug`.
 */
const getProjectsSlugs = (): string[] =>
  getProjectsFileNames().map((name) => name.replace(".md", ""));

/**
 * Get project content from file.
 * @param fileName The name of the project file.
 * @returns The `project` of the project file.
 */
const getProject = (fileName: string): Project => {
  const project = getFileContent(join(__PROJECT_DIR__, fileName)) as Project;
  project.slug = fileName.replace(".md", "");
  return project;
};

/**
 * Get the project with the name of `slug` from project files.
 * @param slug Slug to get `project`.
 * @returns The `project` according to `slug`.
 */
const getProjectBySlug = (slug: string): Project => getProject(slug + ".md");

/**
 * Get the project with the name of `slug` from project files with
 * converted `HTML` content.
 * @param slug Slug to get `project`
 * @returns The `project` with converted `HTML` content.
 */
const getProjectBySlugWithMarkdown = async (slug: string): Promise<Project> => {
  const project = getProjectBySlug(slug);
  project.content = await markdownToHtml(project.content);
  return project;
};

/**
 * Get project list by file names.
 * @param fileNames List of project file names.
 * @returns List of `project`.
 */
const getProjectListByFileNames = (fileNames: string[]): Project[] =>
  getAllItems<Project>(fileNames, getProject);

/**
 * Get project list.
 * @returns List of `project`.
 */
const getProjectList = (): Project[] => {
  // Get all file names from Projects directory.
  const projectFileNames = getProjectsFileNames();

  return getProjectListByFileNames(projectFileNames);
};

export {
  getProjectsFileNames,
  getProjectsSlugs,
  getProject,
  getProjectBySlug,
  getProjectBySlugWithMarkdown,
  getProjectList,
};
