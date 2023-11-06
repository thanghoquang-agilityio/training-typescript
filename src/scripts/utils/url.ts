/**
 * Navigate to a specific web page.
 * @param {string} url - The URL of the web page to navigate to.
 * @param {boolean} isReplace - True to replace the URL in the browser history, false by default.
 */
export const navigatePage = (url: string, isReplace: boolean = false): void => {
  const method: keyof Location = isReplace ? 'replace' : 'assign';

  window.location[method](url);
};
