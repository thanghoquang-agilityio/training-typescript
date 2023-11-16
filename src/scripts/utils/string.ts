export const snakeToCamel = (text: string): string => {
  if (typeof text !== 'string' || !text.trim()) {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
};
