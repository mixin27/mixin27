import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { compareDesc, parseISO } from "date-fns";

import { Blog, Project } from "@/contentlayer/generated";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortBlogs = (blogs: Blog[]) => {
  return blogs
    .slice()
    .sort((a, b) =>
      compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
    );
};

export const sortProjects = (projects: Project[]) => {
  return projects
    .slice()
    .sort((a, b) => compareDesc(parseISO(a.startDate), parseISO(b.startDate)));
};
