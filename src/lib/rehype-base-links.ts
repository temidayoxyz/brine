import { withBase } from './paths';

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/**
 * Rewrite root-relative Markdown links so they keep working when the site is
 * served from a GitHub Pages project path such as /brine/.
 */
export default function rehypeBaseLinks() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'a' && node.properties) {
        const href = node.properties.href;

        if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
          node.properties.href = withBase(href);
        }
      }

      node.children?.forEach(walk);
    };

    walk(tree);
  };
}
