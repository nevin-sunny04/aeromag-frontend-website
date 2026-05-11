export function sanitizeContent(html: string): string {
  if (!html) return '';
  return html.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ');
}
