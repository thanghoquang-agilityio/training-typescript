import { MovieData } from '@/interfaces';
import { snakeToCamel } from '@/utils/string';
import { NAVBAR_LIST } from '@/constants';

export class MovieView {
  public movieDetailElement: HTMLElement | null;
  public trendingElement: HTMLElement | null;
  public imageMovieDetailElement: HTMLElement | null;
  public heartButtonMovieElement: NodeListOf<HTMLElement>;
  public movieDisplayedElement: HTMLElement | null;
  public movieListElement: NodeListOf<HTMLElement>;
  public heartButtonDetailElement: HTMLElement | null;
  public imageDetailElement: HTMLElement | null;
  public categoryElement: HTMLElement | null;
  public filterListElement: NodeListOf<HTMLElement>;
  public loadingElement: NodeListOf<HTMLElement>;

  constructor() {
    // Initialize elements
    this.movieDetailElement = document.querySelector('.card-details');
    this.trendingElement = document.querySelector('.trending-now');
    this.imageMovieDetailElement = document.querySelector('.card-details-cover-image');
    this.heartButtonMovieElement = document.querySelectorAll<HTMLElement>('.button-heart-card');
    this.movieDisplayedElement = document.querySelector('.card-being-displayed');
    this.movieListElement = document.querySelectorAll<HTMLElement>('.card-img');
    this.heartButtonDetailElement = document.querySelector('.button-heart-movie');
    this.imageDetailElement = document.querySelector('.card-details-cover-image');
    this.categoryElement = document.querySelector('.navbar-categories');
    this.filterListElement = document.querySelectorAll<HTMLElement>('.text');
    this.loadingElement = document.querySelectorAll<HTMLElement>('.card-loading');
  }

  /**
   * Get movie Id when click heart button to the change favourites.
   * @param {Function} handler - The change event handler function.
   */
  getMovieIdByMovieButton = (handler: (id: string, movieGenre: keyof MovieData) => void) => {
    this.heartButtonMovieElement = document.querySelectorAll<HTMLElement>('.button-heart-card');

    if (this.heartButtonMovieElement.length) {
      this.heartButtonMovieElement.forEach((element: HTMLElement) => {
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
    }
  };

  addLoadingMovieButton = () => {
    // Add loading when movie detail was displayed
    if (this.movieDetailElement && this.imageMovieDetailElement) {
      this.movieDetailElement.classList.add('card-details-loading');
    }

    // Add prevent event for movie list
    if (this.trendingElement) {
      this.trendingElement.classList.add('trending-now-loading');
    }

    // Add prevent event for movie list
    if (this.trendingElement) {
      this.trendingElement.classList.add('trending-now-loading');
    }
  };

  addLoadingHeartButton = () => {
    this.movieDisplayedElement = document.querySelector('.card-being-displayed');

    // Add loading for movie card
    if (this.movieDisplayedElement) {
      this.movieDisplayedElement.classList.add('card-loading');
    }

    this.addLoadingMovieButton();
  };

  updateLoadingFavourites = (movieId: string) => {
    this.movieDisplayedElement = document.getElementById(movieId);

    // Re-render movie detail
    if (this.movieDisplayedElement) {
      this.movieDisplayedElement.classList.add('card-being-displayed');
    }

    // Remove loading when display movie was completed
    if (this.movieDetailElement) {
      this.movieDetailElement.classList.remove('card-details-loading');
    }

    // Remove prevent event for movie list
    if (this.trendingElement) {
      this.trendingElement.classList.remove('trending-now-loading');
    }
  };

  /**
   * Get movie Id when click movie card to show the details.
   * @param {Function} handler - The show event handler function.
   */
  getMovieIdByMovieCard = (handler: (id: string) => void) => {
    if (this.trendingElement) {
      this.movieListElement = this.trendingElement.querySelectorAll<HTMLElement>('.card-img');

      if (this.movieListElement.length) {
        this.movieListElement.forEach((element: HTMLElement) => {
          element.addEventListener('click', (event: MouseEvent) => {
            const targetElement = event.target as HTMLElement;

            if (targetElement) {
              const parentFigureElement: HTMLElement | null = targetElement.closest('figure');
              let movieId: string | null = null;

              if (parentFigureElement) {
                movieId = parentFigureElement.getAttribute('id');
              }

              if (movieId) {
                // Add loader when loading API
                if (this.movieDetailElement) {
                  this.movieDetailElement.classList.add('card-loading');
                  this.movieDetailElement.innerHTML = '<span class="loader"></span>';
                }
                // Disable heart button in list card and blur it
                if (this.trendingElement) {
                  this.trendingElement.classList.add('trending-now-loading');
                }

                this.movieDisplayedElement = document.querySelector('.card-being-displayed');

                // Remove class in the movie card was selected last time
                if (this.movieDisplayedElement) {
                  this.movieDisplayedElement.classList.remove('card-being-displayed');
                }

                handler(movieId);

                // Update style for movie was displayed
                if (parentFigureElement) {
                  parentFigureElement.classList.add('card-being-displayed');
                }
                // Update style for movie list
                if (this.trendingElement) {
                  this.trendingElement.classList.remove('trending-now-loading');
                  this.trendingElement.classList.add('trending-now-after-loading');
                }

                this.movieDetailElement = document.querySelector('.card-details');
              }
            }
          });
        });
      }
    }
  };

  /**
   * Get movie Id when click heart button to the change favourites.
   * @param {Function} handler - The change event handler function.
   */
  getMovieIdByHeartButton = (handler: (id: string) => void) => {
    this.heartButtonDetailElement = document.querySelector('.button-heart-movie');

    if (this.heartButtonDetailElement) {
      this.heartButtonDetailElement.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement && this.heartButtonDetailElement) {
          const movieId = this.heartButtonDetailElement.getAttribute('id');

          if (movieId) {
            handler(movieId);
          }
        }
      });
    }
  };

  /**
   * Get image movie detail.
   */
  getImageDetailElement = (): boolean => {
    this.imageDetailElement = document.querySelector('.card-details-cover-image');

    if (this.imageDetailElement) {
      return true;
    }

    return false;
  };

  /**
   * Get category to filter movie list.
   * @param {Function} handler - The change event handler function.
   */
  filterMovie = (handler: (filter: string) => void) => {
    this.categoryElement = document.querySelector('.navbar-categories');

    if (this.categoryElement) {
      this.filterListElement = this.categoryElement.querySelectorAll<HTMLElement>('.text');

      if (this.filterListElement.length) {
        this.filterListElement.forEach((filterElement: HTMLElement) => {
          filterElement.addEventListener('click', (event: MouseEvent) => {
            const targetElement = event.target as HTMLElement;

            if (targetElement) {
              const filterObject = NAVBAR_LIST.find(
                (item) => item.title === targetElement.textContent,
              );

              if (filterObject) {
                this.removeMovieDetail();
                this.addLoadingMovieList();

                handler(filterObject.category);
              }
            }
          });
        });
      }
    }
  };

  /**
   * Remove movie detail.
   */
  removeMovieDetail = () => {
    this.movieDetailElement = document.querySelector('.card-details');
    this.trendingElement = document.querySelector('.trending-now-after-loading');

    if (this.movieDetailElement) {
      this.movieDetailElement.innerHTML = '';
    }

    if (this.trendingElement) {
      this.trendingElement.classList.remove('trending-now-after-loading');
    }
  };

  /**
   * Remove loading.
   */
  removeLoading = () => {
    this.loadingElement = document.querySelectorAll<HTMLElement>('.card-loading');

    if (this.loadingElement) {
      this.loadingElement.forEach((element: HTMLElement) => {
        element.classList.remove('card-loading');
      });
    }
  };

  /**
   * Add loading when loading movie list.
   */
  addLoadingMovieList = () => {
    this.loadingElement = document.querySelectorAll<HTMLElement>('.movie-list');

    if (this.loadingElement) {
      this.loadingElement.forEach((element: HTMLElement) => {
        element.innerHTML = '<span class="loader"></span>';
        element.classList.add('card-loading');
      });
    }
  };
}
