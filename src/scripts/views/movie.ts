import { MovieData } from '@/interfaces';
import { snakeToCamel } from '@/utils/string';

export class MovieView {
  /**
   * Get movie Id when click heart button to the change favourites.
   * @param {Function} handler - The change event handler function.
   */
  getMovieIdByMovieButton = (handler: (id: string, movieGenre: keyof MovieData) => void) => {
    const buttonAddOrRemoveFavouritesMovie =
      document.querySelectorAll<HTMLElement>('.button-heart-card');

    buttonAddOrRemoveFavouritesMovie.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement) {
          const parentFigure: HTMLElement | null = targetElement.closest('figure');
          let movieId: string | null = null;
          let movieGenre: keyof MovieData = 'trending';

          if (parentFigure) {
            parentFigure.classList.add('card-loading');
            movieId = parentFigure.getAttribute('id');

            // Get movie genre in class name
            const classNameMovie = parentFigure.className.split(' ')[0];

            movieGenre = snakeToCamel(
              classNameMovie.split('-').slice(1).join('-'),
            ) as keyof MovieData;
          }

          if (movieId && movieGenre) {
            handler(movieId, movieGenre);
          }
        }
      });
    });
  };

  addLoadingForMovieDetail = () => {
    const movieDetailElement: HTMLElement | null = document.querySelector('.card-details');
    const imageDetailElement: HTMLElement | null = document.querySelector(
      '.card-details-cover-image',
    );

    // Add loading when movie detail was displayed
    if (movieDetailElement && imageDetailElement) {
      movieDetailElement.classList.add('card-details-loading');
    }
  };

  updateLoadingForMovieDetail = (movieId: string) => {
    const movieDisplayedElement: HTMLElement | null = document.getElementById(movieId);
    const movieDetailElement: HTMLElement | null = document.querySelector('.card-details');

    // Re-render movie detail
    if (movieDisplayedElement) {
      movieDisplayedElement.classList.add('card-being-displayed');
    }

    // Remove loading when display movie was completed
    if (movieDetailElement) {
      movieDetailElement.classList.remove('card-details-loading');
    }
  };

  /**
   * Get movie Id when click movie card to show the details.
   * @param {Function} handler - The show event handler function.
   */
  getMovieIdByMovieCard = (handler: (id: string) => void) => {
    const trendingMovieElement: HTMLElement | null = document.querySelector('.trending-now');
    let movieListElement: NodeListOf<HTMLElement> | null = null;

    if (trendingMovieElement) {
      movieListElement = trendingMovieElement.querySelectorAll<HTMLElement>('.card-img');

      movieListElement.forEach((element: HTMLElement) => {
        element.addEventListener('click', (event: MouseEvent) => {
          const targetElement = event.target as HTMLElement;

          if (targetElement) {
            const parentFigure: HTMLElement | null = targetElement.closest('figure');
            let movieId: string | null = null;

            if (parentFigure) {
              movieId = parentFigure.getAttribute('id');
            }

            if (movieId) {
              const movieDetailElement: HTMLElement | null =
                document.querySelector('.card-details');
              const trendingMovieElement: HTMLElement | null =
                document.querySelector('.trending-now');
              const movieBeingDisplayedElement =
                document.querySelectorAll<HTMLElement>('.card-being-displayed');
              const parentFigureElement: HTMLElement | null = targetElement.closest('figure');

              // Add loader when loading API
              if (movieDetailElement) {
                movieDetailElement.classList.add('card-loading');
                movieDetailElement.innerHTML = '<span class="loader"></span>';
              }
              // Disable heart button in list card and blur it
              if (trendingMovieElement) {
                trendingMovieElement.classList.add('trending-now-loading');
              }
              // Remove class in the movie card was selected last time
              if (movieBeingDisplayedElement.length) {
                movieBeingDisplayedElement.forEach((element) => {
                  element.classList.remove('card-being-displayed');
                });
              }

              handler(movieId);

              // Update style for movie was displayed
              if (parentFigureElement) {
                parentFigureElement.classList.add('card-being-displayed');
              }
              // Update style for movie list
              if (trendingMovieElement) {
                trendingMovieElement.classList.remove('trending-now-loading');
                trendingMovieElement.classList.add('trending-now-after-loading');
              }
            }
          }
        });
      });
    }
  };
}
