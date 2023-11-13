/**
 * @function disableElement
 * Disable the element with selector.
 * @param selector
 */
export const disableElement = (selector: string): void => {
  const elementList = document.querySelectorAll<HTMLElement>(selector);
  elementList.forEach((element: HTMLElement) => {
    if (element !== null) {
      element.style.pointerEvents = 'none';
    }
  });
};

/**
 * @function enableElement
 * Enable the element with selector.
 * @param selector
 */
export const enableElement = (selector: string): void => {
  const elementList = document.querySelectorAll<HTMLElement>(selector);
  elementList.forEach((element: HTMLElement) => {
    if (element !== null) {
      element.style.pointerEvents = '';
    }
  });
};
