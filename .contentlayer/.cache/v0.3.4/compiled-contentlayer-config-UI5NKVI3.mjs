// contentlayer.config.js
import {
  defineDocumentType,
  defineNestedType,
  makeSource
} from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";

// lib/rehype-pre-raw.js
import { visit } from "unist-util-visit";
var preProcessRehype = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code")
        return;
      node.__rawString__ = codeEl.children?.[0].value;
    }
  });
};
var postProcessRehype = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "figure") {
      if (!("data-rehype-pretty-code-figure" in node.properties)) {
        return;
      }
      const preElement = node.children.at(-1);
      if (preElement.tagName !== "pre") {
        return;
      }
      preElement.properties["__rawString__"] = node.__rawString__;
    }
  });
};

// contentlayer.config.js
var ProjectLink = defineNestedType(() => ({
  name: "Link",
  fields: {
    live: { type: "string" },
    github: { type: "string" },
    playstore: { type: "string" },
    appstore: { type: "string" }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "**/projects/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    image: {
      type: "image",
      required: true
    },
    links: {
      type: "list",
      of: ProjectLink
    },
    category: {
      type: "string",
      required: true
    },
    tags: {
      type: "list",
      of: { type: "string" }
    },
    developers: {
      type: "list",
      of: { type: "string" }
    },
    startDate: {
      type: "date",
      required: true
    },
    endDate: {
      type: "date"
    },
    currentlyWorking: {
      type: "boolean",
      default: false
    },
    updatedAt: {
      type: "date",
      required: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath
    }
  }
}));
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "**/blogs/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    image: {
      type: "image",
      required: true
    },
    isPublished: {
      type: "boolean",
      default: true
    },
    author: {
      type: "string",
      required: true
    },
    tags: {
      type: "list",
      of: { type: "string" }
    },
    publishedAt: {
      type: "date",
      required: true
    },
    updatedAt: {
      type: "date",
      required: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath
    },
    readingTime: {
      type: "json",
      resolve: (doc) => readingTime(doc.body.raw)
    },
    toc: {
      type: "json",
      resolve: async (doc) => {
        const regexp = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
        const slugger = new GithubSlugger();
        const headings = Array.from(doc.body.raw.matchAll(regexp)).map(
          ({ groups }) => {
            const flag = groups?.flag;
            const content = groups?.content;
            return {
              level: flag?.length === 1 ? "one" : flag?.length === 2 ? "two" : "three",
              text: content,
              slug: content ? slugger.slug(content) : void 0
            };
          }
        );
        return headings;
      }
    }
  }
}));
var codeOptions = {
  theme: "github-dark",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  }
};
var contentlayer_config_default = makeSource({
  contentDirPath: "./content/",
  // contentDirInclude: ["blogs", "projects"],
  documentTypes: [Project, Blog],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      preProcessRehype,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [rehypePrettyCode, codeOptions],
      postProcessRehype
    ]
  }
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-UI5NKVI3.mjs.map
