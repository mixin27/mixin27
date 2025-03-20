"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { Project } from "@/contentlayer/generated";
import Image from "next/image";
import { PreCustom } from "@/components/rehype/pre-custom";
import { BasicItems } from "@/components/rehype/basic-items";

type Props = {
  project: Project;
};

const mdxComponents = {
  Image,
  pre: PreCustom,
  ...BasicItems,
};

const ProjectRenderMdx = ({ project }: Props) => {
  const MDXContent = useMDXComponent(project.body.code);
  return (
    <div className="font-primary prose lg:prose-xl prose-p:text-lg text-white/80 font-medium max-w-max prose-blockquote:bg-green-200 prose-blockquote:text-primary prose-blockquote:p-2 prose-blockquote:px-6 prose-blockquote:border-green-700 prose-blockquote:not-italic prose-blockquote:rounded-r-lg  prose-li:marker:text-accent prose-code:text-green-500 prose-a:text-accent prose-headings:text-white prose-strong:text-white prose-strong:font-bold prose-strong:prose-blockquote:text-black prose-strong:prose-blockquote:font-bold">
      <MDXContent components={mdxComponents} />
    </div>
  );
};

export default ProjectRenderMdx;
