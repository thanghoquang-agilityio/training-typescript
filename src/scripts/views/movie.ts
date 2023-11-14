export class MovieView {
  /**
   * Binds a add event handler to the add favourites button.
   * @param {Function} handler - The add event handler function.
   */
  bindAddOrRemoveFavouritesEvent = (
    handler: (id: string, favouritesList: string[], element: HTMLElement) => void,
  ) => {
    const buttonAddOrRemoveFavouritesMovie =
      document.querySelectorAll<HTMLElement>('.button-heart-card');

    buttonAddOrRemoveFavouritesMovie.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement) {
          const parentFigure = targetElement.closest('figure') as HTMLElement;
          const movieId = parentFigure.getAttribute('id');
          const dataFavourites = parentFigure.getAttribute('data-favourites');
          let favouritesList: string[] = [];

          if (dataFavourites) favouritesList = dataFavourites.split(',');

          if (movieId) {
            handler(movieId, favouritesList, targetElement);
          }
        }
      });
    });
  };

  /**
   * Binds a show event handler to click the movie card.
   * @param {Function} handler - The add event handler function.
   */
  bindShowMovieDetailEvent = (handler: (id: string, element: HTMLElement) => void) => {
    const trendingMovieElement = document.querySelector('.trending-movie-wrapper') as HTMLElement;
    const movieListElement = trendingMovieElement.querySelectorAll<HTMLElement>('.card-trending');

    movieListElement.forEach((element: HTMLElement) => {
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
