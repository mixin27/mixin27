import { Education } from "@interfaces/Education";
import { join } from "path";
import { getDirectory, getFileContent, getFileNames } from "./file";
import { getAllItems } from "./helpers";
import { markdownToHtml } from "./md";

/**
 * Education directory
 */
const __EDUCATION_DIR__ = getDirectory("/content/educations");

/**
 * Get education file names from /content/educations/
 * @returns List of file name under the educations directory.
 */
const getEducationFileNames = (): string[] => getFileNames(__EDUCATION_DIR__);

/**
 * Get list slug from file names.
 * @returns List of `slug`.
 */
const getEducationSlugs = (): string[] =>
  getEducationFileNames().map((name) => name.replace(".md", ""));

/**
 * Get education content from file.
 * @param fileName The name of the education file.
 * @returns The `Education` of the education file.
 */
const getEducation = (fileName: string): Education => {
  const education = getFileContent(
    join(__EDUCATION_DIR__, fileName)
  ) as Education;
  education.slug = fileName.replace(".md", "");
  return education;
};

/**
 * Get the education with the name of `slug` from education files.
 * @param slug Slug to get `Education`.
 * @returns The `Education` according to `slug`.
 */
const getEducationBySlug = (slug: string): Education =>
  getEducation(slug + ".md");

/**
 * Get the education with the name of `slug` from education files with
 * converted `HTML` content.
 * @param slug Slug to get `Education`
 * @returns The `Education` with converted `HTML` content.
 */
const getEducationBySlugWithMarkdown = async (
  slug: string
): Promise<Education> => {
  const education = getEducationBySlug(slug);
  education.content = await markdownToHtml(education.content);
  return education;
};

/**
 * Get education list by file names.
 * @param fileNames List of education file names.
 * @returns List of `Education`.
 */
const getEducationListByFileNames = (fileNames: string[]): Education[] =>
  getAllItems<Education>(fileNames, getEducation);

/**
 * Get education list.
 * @returns List of `Education`.
 */
const getEducationList = (): Education[] => {
  // Get all file names from educations directory.
  const educationFileNames = getEducationFileNames();

  return getEducationListByFileNames(educationFileNames);
};

export {
  getEducationFileNames,
  getEducationSlugs,
  getEducation,
  getEducationBySlug,
  getEducationBySlugWithMarkdown,
  getEducationList,
};
