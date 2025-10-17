"use client";

import { Content } from "@/.contentlayer/generated";
import AppContentRenderMdx from "@/components/elements/apps/app-content-render-mdx";

type Props = {
  slug: string;
  appContent: Content;
};

const AppContentDetails = ({ appContent }: Props) => {

  return (
    <article className="container mx-auto">
      <AppContentRenderMdx appContent={appContent} />
    </article>
  );
};

export default AppContentDetails;
