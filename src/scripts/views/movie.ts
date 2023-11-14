export class MovieView {
  constructor() {}

  /**
   * Binds a add event handler to the add favourites button.
   * @param {Function} handler - The add event handler function.
   */
  bindAddOrRemoveFavouritesEvent = (handler: (id: string, element: HTMLElement) => void) => {
    const buttonAddOrRemoveFavouritesMovie =
      document.querySelectorAll<HTMLElement>('.button-heart-card');

    buttonAddOrRemoveFavouritesMovie.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement) {
          const parentFigure = targetElement.closest('figure') as HTMLElement;
          const movieId = parentFigure.getAttribute('id');

          if (movieId) {
            handler(movieId, targetElement);
          }
        }
      });
    });
  };
}
