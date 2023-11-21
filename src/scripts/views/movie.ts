import { resetErrors, validateForm } from '@/utils/validation';
import { convertFileToBase64, getVideoDuration } from '@/utils/file';
import { snakeToCamel } from '@/utils/string';
import { Movie, MovieData, MovieForm } from '@/interfaces';
import { Category } from '@/types';
import { FORM_TITLES, NAVBAR_LIST } from '@/constants';

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
  public createMovieButtonElement: HTMLElement | null;
  public divFormMovieElement: HTMLElement | null;
  public formMovieElement: HTMLFormElement | null;
  public categorySelectElement: HTMLSelectElement | null;
  public formTitleElement: HTMLElement | null;
  public cancelButtonFormElement: HTMLElement | null;
  public submitButtonFormElement: HTMLElement | null;

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
    this.createMovieButtonElement = document.querySelector('.create-movie');
    this.divFormMovieElement = document.querySelector('.form-movie');
    this.formMovieElement = document.querySelector('#movie-form');
    this.categorySelectElement = document.querySelector('#category');
    this.formTitleElement = document.querySelector('#movie-form-title');
    this.cancelButtonFormElement = document.querySelector('#btn-movie-cancel');
    this.submitButtonFormElement = document.querySelector('.create-movie');
  }

  /**
   * Get movie Id when click heart button to the change favourites.
   * @param {Function} handler - The change event handler function.
   */
  getMovieIdByMovieButton = (handler: (id: number, movieGenre: keyof MovieData) => void) => {
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
              handler(parseInt(movieId), movieGenre);
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

  updateLoadingFavourites = (movieId: number) => {
    this.movieDisplayedElement = document.getElementById(movieId.toString());

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
  getMovieIdByMovieCard = (handler: (id: number) => void) => {
    this.trendingElement = document.querySelector('.trending-now');

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

                handler(parseInt(movieId));

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
  getMovieIdByHeartButton = (handler: (id: number) => void) => {
    this.heartButtonDetailElement = document.querySelector('.button-heart-movie');

    if (this.heartButtonDetailElement) {
      this.heartButtonDetailElement.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement && this.heartButtonDetailElement) {
          const movieId = this.heartButtonDetailElement.getAttribute('id');

          if (movieId) {
            handler(parseInt(movieId));
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
              const dataFilter = NAVBAR_LIST.find(
                (item) => item.title === targetElement.textContent,
              );

              if (dataFilter) {
                this.removeMovieDetail();
                this.addLoadingMovieList();

                handler(dataFilter.category);
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
  private removeMovieDetail = () => {
    this.movieDetailElement = document.querySelector('.card-details');
    this.trendingElement = document.querySelector('.trending-now-after-loading');

    if (this.movieDetailElement) {
      this.movieDetailElement.innerHTML = '';

      if (this.trendingElement) {
        this.trendingElement.classList.remove('trending-now-after-loading');
      }
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
  private addLoadingMovieList = () => {
    this.loadingElement = document.querySelectorAll<HTMLElement>('.movie-list');

    if (this.loadingElement) {
      this.loadingElement.forEach((element: HTMLElement) => {
        element.innerHTML = '<span class="loader"></span>';
        element.classList.add('card-loading');
      });
    }
  };

  /**
   * Populate a <select> element with options based on a list of participants.
   * @param {HTMLSelectElement} selectElement - The <select> element to populate.
   */
  private populateSelectElement = (selectElement: HTMLSelectElement) => {
    NAVBAR_LIST.forEach((item) => {
      const option = document.createElement('option');

      option.textContent = item.title;
      option.value = item.category.toString();

      selectElement.appendChild(option);
    });
  };

  /**
   * Display form create of movie.
   */
  private displayFormMovie = (movie?: Movie) => {
    this.divFormMovieElement = document.querySelector('.form-movie');
    this.categorySelectElement = document.querySelector('#category');

    if (this.divFormMovieElement && this.categorySelectElement) {
      this.divFormMovieElement.style.display = 'block';
      this.populateSelectElement(this.categorySelectElement);

      this.formTitleElement = document.querySelector('#movie-form-title');

      if (this.formTitleElement) {
        if (movie) {
          this.formTitleElement.textContent = FORM_TITLES.movieFormEdit;
        } else {
          this.formTitleElement.textContent = FORM_TITLES.movieFormCreate;
        }
      }
    }

    this.closeFormMovie();
  };

  /**
   * Close form of movie.
   */
  private closeFormMovie = () => {
    this.cancelButtonFormElement = document.querySelector('#btn-movie-cancel');

    if (this.cancelButtonFormElement) {
      this.cancelButtonFormElement.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();

        if (this.divFormMovieElement) {
          this.divFormMovieElement.style.display = 'none';
        }

        if (this.categorySelectElement) {
          this.categorySelectElement.innerHTML = '';
        }

        if (this.divFormMovieElement) {
          resetErrors(this.divFormMovieElement);
        }
      });
    }
  };

  /**
   * Display form create movie.
   */
  displayCreateMovieForm = () => {
    this.createMovieButtonElement = document.querySelector('.create-movie');

    if (this.createMovieButtonElement) {
      this.createMovieButtonElement.addEventListener('click', () => {
        this.displayFormMovie();
      });
    }
  };

  /**
   * Submit form movie.
   * @param {Function} handler - The submit event handler function.
   */
  getDataInMovieForm = (handler: (movieForm: MovieForm, id?: number) => void) => {
    if (this.formTitleElement) {
      if (this.divFormMovieElement) {
        this.submitButtonFormElement =
          this.divFormMovieElement.querySelector('.button-watch-movie');

        if (this.submitButtonFormElement) {
          this.submitButtonFormElement.addEventListener('click', async (event: MouseEvent) => {
            let isValidForm = false;
            if (this.divFormMovieElement && this.formMovieElement) {
              event.preventDefault();

              this.formMovieElement.classList.add('card-loading');

              resetErrors(this.divFormMovieElement);
              isValidForm = validateForm(this.divFormMovieElement);

              if (isValidForm) {
                this.formMovieElement = document.querySelector('#movie-form');

                if (this.formMovieElement) {
                  const formData = new FormData(this.formMovieElement);
                  const data = await this.extractFormData(formData);

                  this.formTitleElement = document.querySelector('#movie-form-title');

                  if (this.formTitleElement) {
                    const isCreate =
                      this.formTitleElement.textContent === FORM_TITLES.movieFormCreate;

                    if (isCreate) {
                      handler(data);
                    }
                  }
                }
              }

              if (this.formMovieElement) {
                this.formMovieElement.classList.remove('card-loading');
              }
            }
          });
        }
      }
    }
  };

  /**
   * Extract form data from a FormData object and convert it into a structured ProjectForm object.
   *
   * @param {FormData} formData - The FormData object containing the form input values.
   * @returns {ProjectFormInputs} The structured form data.
   */
  async extractFormData(formData: FormData): Promise<MovieForm> {
    const extractValue = (key: string) => (formData.get(key) as string).trim();

    const getOptionalFileBase64 = async (key: string, defaultValue: string = '') => {
      const file = formData.get(key) as File;

      return file.size > 0 ? await convertFileToBase64(file) : defaultValue;
    };

    const imgBase64 = await getOptionalFileBase64('image,required');
    const videoBase64 = await getOptionalFileBase64('video,required');

    let duration = '';
    const inputVideoElement = document.getElementById('video');

    if (inputVideoElement) {
      const video = await getVideoDuration(inputVideoElement as HTMLInputElement);

      if (video.length && video[0].duration) {
        duration = video[0].duration;
      }
    }

    const yearOfReleaseString = formData.get('year-of-release,required') as string;
    let yearOfReleaseNumber = new Date().getFullYear();

    if (yearOfReleaseString) {
      yearOfReleaseNumber = parseInt(yearOfReleaseString);
    }

    const isTrendingString = formData.get('is-trending') as string;
    let isTrending = true;

    if (isTrendingString) {
      isTrending = Boolean(isTrendingString);
    }

    const ratingDefault = 0;
    const favouritesDefault: number[] = [];
    const incompletenessDefault: number[] = [];

    return {
      title: extractValue('title,required'),
      image: imgBase64,
      category: formData.get('category') as Category,
      type: extractValue('type,required'),
      release: yearOfReleaseNumber,
      rating: ratingDefault,
      video: videoBase64,
      duration: duration,
      isTrending: isTrending,
      description: extractValue('description,required'),
      favourites: favouritesDefault,
      incompleteness: incompletenessDefault,
    };
  }
}
