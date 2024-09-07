import { Project } from "@/interfaces/project";
import { NextPage } from "next";
import React from "react";

type Props = {
  project: Project;
};

const WorkDetail: NextPage<Props> = ({ project }) => {
  return (
    <div className="container mx-auto">
      {/* prose lg:prose-lg  */}
      <article className="markdown-image-50 markdown-code">
        <div dangerouslySetInnerHTML={{ __html: project.content }} />
      </article>
    </div>
  );
};

export default WorkDetail;
