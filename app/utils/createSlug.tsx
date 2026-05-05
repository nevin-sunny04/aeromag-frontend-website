export const CreateSlug = (input: string): string => {
  return input
    .trim()
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};
