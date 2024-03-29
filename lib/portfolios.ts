import { Portfolio } from "@interfaces/Portofolio";
import { join } from "path";
import { getDirectory, getFileContent, getFileNames } from "./file";
import { getAllItems } from "./helpers";
import { markdownToHtml } from "./md";

/**
 * Portfolios directory
 */
const __PORTFOLIO_DIR__ = getDirectory("/content/portfolios");

/**
 * Get portfolio file names from /content/portfolios/
 * @returns List of file name under the portfolios directory.
 */
const getPortfoliosFileNames = (): string[] => getFileNames(__PORTFOLIO_DIR__);

/**
 * Get list slug from file names.
 * @returns List of `slug`.
 */
const getPortfoliosSlugs = (): string[] =>
  getPortfoliosFileNames().map((name) => name.replace(".md", ""));

/**
 * Get portfolio content from file.
 * @param fileName The name of the portfolio file.
 * @returns The `Portfolio` of the portfolio file.
 */
const getPortfolio = (fileName: string): Portfolio => {
  const portfolio = getFileContent(
    join(__PORTFOLIO_DIR__, fileName)
  ) as Portfolio;
  portfolio.slug = fileName.replace(".md", "");
  return portfolio;
};

/**
 * Get the portfolio with the name of `slug` from portfolio files.
 * @param slug Slug to get `portfolio`.
 * @returns The `portfolio` according to `slug`.
 */
const getPortfolioBySlug = (slug: string): Portfolio =>
  getPortfolio(slug + ".md");

/**
 * Get the portfolio with the name of `slug` from portfolio files with
 * converted `HTML` content.
 * @param slug Slug to get `portfolio`
 * @returns The `portfolio` with converted `HTML` content.
 */
const getPortfolioBySlugWithMarkdown = async (
  slug: string
): Promise<Portfolio> => {
  const portfolio = getPortfolioBySlug(slug);
  portfolio.content = await markdownToHtml(portfolio.content);
  return portfolio;
};

/**
 * Get portfolio list by file names.
 * @param fileNames List of portfolio file names.
 * @returns List of `portfolio`.
 */
const getPortfolioListByFileNames = (fileNames: string[]): Portfolio[] =>
  getAllItems<Portfolio>(fileNames, getPortfolio);

/**
 * Get portfolio list.
 * @returns List of `portfolio`.
 */
const getPortfolioList = (): Portfolio[] => {
  // Get all file names from portfolios directory.
  const portfolioFileNames = getPortfoliosFileNames();

  return getPortfolioListByFileNames(portfolioFileNames);
};

export {
  getPortfoliosFileNames,
  getPortfoliosSlugs,
  getPortfolio,
  getPortfolioBySlug,
  getPortfolioBySlugWithMarkdown,
  getPortfolioList,
};
