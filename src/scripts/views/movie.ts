import { Movie } from '@/interfaces';
import { USER_ID } from '@/constants';

export class MovieView {
  constructor() {}

  /**
   * Binds a add event handler to the add favourites button.
   * @param {Function} handler - The add event handler function.
   */
  bindAddFavouritesEvent = (
    handler: (id: string, isCreated: boolean, element: HTMLElement) => void,
  ) => {
    const buttonAddMovieIntoFavourites = document.querySelectorAll<HTMLElement>(
      '.add-movie-into-favourites',
    );

    buttonAddMovieIntoFavourites.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement) {
          const parentFigure: HTMLElement | null = targetElement.closest('figure');
          const movieId = parentFigure?.getAttribute('id');

          if (movieId) {
            handler(movieId, true, targetElement);
          }
        }
      });
    });
  };
}
