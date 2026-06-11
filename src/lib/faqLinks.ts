export function stripFaqMarkdownLinks(value: string): string {
  return value.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1');
}

export function isAllowedFaqLinkHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//');
  }

  return /^https?:\/\//i.test(trimmed);
}
