import { basePath, siteUrl } from '../config';

const normalizedBase = basePath === '/' ? '' : basePath.replace(/\/+$/, '');

/**
 * Prefix a root-relative path with the configured GitHub Pages base path.
 * Absolute URLs, protocol-relative URLs, hashes, and relative paths are left
 * untouched. Paths that already include the base are also left untouched.
 */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  if (normalizedBase && (path === normalizedBase || path.startsWith(`${normalizedBase}/`))) {
    return path;
  }

  return `${normalizedBase}${path}` || '/';
}

/** Turn a root-relative path into an absolute production URL. */
export function absoluteUrl(path: string): string {
  return new URL(withBase(path), siteUrl).href;
}
