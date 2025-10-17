export function getCodeOptions(isDark: boolean) {
  return {
    theme: isDark ? 'github-dark' : 'github-light',
    onVisitLine(node: any) {
      if (node.children.length === 0) {
        node.children = [{ type: 'text', value: ' ' }];
      }
    },
  };
}

// For server-side compilation, you might need to pass theme as a parameter
export const codeOptionsLight = {
  theme: 'github-light',
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};

export const codeOptionsDark = {
  theme: 'github-dark',
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
};
