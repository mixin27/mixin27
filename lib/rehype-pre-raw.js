import { visit } from "unist-util-visit";

export const preProcessRehype = () => (tree) => {
  // visit(tree, (node) => {
  //   if (node?.type === "element" && node?.tagName === "pre") {
  //     const [codeEl] = node.children;

  //     if (codeEl.tagName !== "code") return;

  //     node.raw = codeEl.children?.[0].value;
  //   }
  // });
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;

      if (codeEl.tagName !== "code") return;

      node.__rawString__ = codeEl.children?.[0].value;
    }
  });
};

export const postProcessRehype = () => (tree) => {
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
  // visit(tree, "element", (node) => {
  //   if (node?.type === "element" && node?.tagName === "pre") {
  //     node.properties["raw"] = node.raw;
  //     // console.log(node) here to see if you're getting the raw text
  //   }
  // });
};
