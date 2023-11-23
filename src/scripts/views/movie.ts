import { resetErrors, validateForm, convertSnakeToCamel, extractFormData } from '@/utils';
import { Movie, MovieData } from '@/interfaces';
import { ERROR_MESSAGES, FORM_TITLES, NAVBAR_LIST } from '@/constants';

export class MovieView {
  private movieDetailElement: HTMLElement | null;
  private trendingElement: HTMLElement | null;
  private imageMovieDetailElement: HTMLElement | null;
  private heartButtonMovieElement: NodeListOf<HTMLElement>;
  private movieDisplayedElement: HTMLElement | null;
  private movieListElement: NodeListOf<HTMLElement>;
  private heartButtonDetailElement: HTMLElement | null;
  private imageDetailElement: HTMLElement | null;
  private categoryNavbarElement: HTMLElement | null;
  private filterListElement: NodeListOf<HTMLElement>;
  private loadingElement: NodeListOf<HTMLElement>;
  private trendingMovieListElement: NodeListOf<HTMLElement>;

  // Element of Form
  private createMovieButtonElement: HTMLElement | null;
  private divFormMovieElement: HTMLElement | null;
  private formMovieElement: HTMLFormElement | null;
  private categorySelectElement: HTMLSelectElement | null;
  private formTitleElement: HTMLElement | null;
  private cancelButtonFormElement: HTMLElement | null;
  private submitButtonFormElement: HTMLElement | null;
  private inputListFormElement: NodeListOf<HTMLInputElement>;

  // Element of all field input in Form
  private titleElement: HTMLInputElement | null;
  private imageElement: HTMLInputElement | null;
  private categoryElement: HTMLInputElement | null;
  private typeElement: HTMLInputElement | null;
  private yearElement: HTMLInputElement | null;
  private videoElement: HTMLInputElement | null;
  private descriptionElement: HTMLInputElement | null;
  private imagePreviewElement: HTMLInputElement | null;
  private videoPreviewElement: HTMLInputElement | null;
  private videoClosetElement: HTMLElement | null;

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
    this.categoryNavbarElement = document.querySelector('.navbar-categories');
    this.filterListElement = document.querySelectorAll<HTMLElement>('.text');
    this.loadingElement = document.querySelectorAll<HTMLElement>('.card-loading');
    this.trendingMovieListElement = document.querySelectorAll<HTMLElement>('.card-trending');

    this.createMovieButtonElement = document.querySelector('.create-movie');
    this.divFormMovieElement = document.querySelector('.form-movie');
    this.formMovieElement = document.getElementById('movie-form') as HTMLFormElement;
    this.categorySelectElement = document.getElementById('category') as HTMLSelectElement;
    this.formTitleElement = document.getElementById('movie-form-title');
    this.cancelButtonFormElement = document.getElementById('btn-movie-cancel');
    this.submitButtonFormElement = document.querySelector('.create-movie');
    this.inputListFormElement = document.querySelectorAll<HTMLInputElement>('input');

    this.titleElement = document.getElementById('title') as HTMLInputElement;
    this.imageElement = document.getElementById('image') as HTMLInputElement;
    this.categoryElement = document.getElementById('category') as HTMLInputElement;
    this.typeElement = document.getElementById('type') as HTMLInputElement;
    this.yearElement = document.getElementById('year-of-release') as HTMLInputElement;
    this.videoElement = document.getElementById('video') as HTMLInputElement;
    this.descriptionElement = document.getElementById('description') as HTMLInputElement;
    this.imagePreviewElement = document.getElementById('movie-image-preview') as HTMLInputElement;
    this.videoPreviewElement = document.getElementById('movie-video-preview') as HTMLInputElement;
    this.videoClosetElement = document.querySelector('video');
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

              movieGenre = convertSnakeToCamel(
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

  /**
   * Add loading card movie when clicking favorite button in card movie
   */
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

  /**
   * Add loading card movie when clicking favorite button in card details
   */
  addLoadingHeartButton = () => {
    this.movieDisplayedElement = document.querySelector('.card-being-displayed');

    // Add loading for movie card
    if (this.movieDisplayedElement) {
      this.movieDisplayedElement.classList.add('card-loading');
    }

    this.addLoadingMovieButton();
  };

  /**
   * Remove loading card movie when clicking favorite button
   * @param {string} movieId - The id of movie.
   */
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
   * @param {Function} handler - The change event handler function.
   */
  getMovieIdByMovieCard = (handler: (id: number) => void) => {
    this.trendingElement = document.querySelector('.trending-now');

    if (this.trendingElement) {
      this.movieListElement = this.trendingElement.querySelectorAll<HTMLElement>('.card-img');

      if (this.movieListElement.length) {
        this.movieListElement.forEach((element: HTMLElement) => {
          element.addEventListener('click', async (event: MouseEvent) => {
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

                // Update style for movie detail
                if (this.movieDetailElement) {
                  this.movieDetailElement.classList.remove('card-loading');
                }
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
    this.categoryNavbarElement = document.querySelector('.navbar-categories');

    if (this.categoryNavbarElement) {
      this.filterListElement = this.categoryNavbarElement.querySelectorAll<HTMLElement>('.text');

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
    if (this.loadingElement) {
      this.loadingElement.forEach((element: HTMLElement) => {
        element.innerHTML = '<span class="loader"></span>';
        element.classList.add('card-loading');
      });
    }
  };

  /**
   * Populate a <select> element with options based on a list of NAVBAR_LIST.
   * @param {HTMLSelectElement} selectElement - The <select> element to populate.
   */
  private addOption = (selectElement: HTMLSelectElement) => {
    if (selectElement) {
      NAVBAR_LIST.forEach((item) => {
        const option = document.createElement('option');

        option.textContent = item.title;
        option.value = item.category.toString();

        selectElement.appendChild(option);
      });
    }
  };

  /**
   * Display form create of movie.
   * @param {Movie} movie - The movie may or may not be there.
   */
  displayFormMovie = (movie?: Movie) => {
    if (this.divFormMovieElement && this.categorySelectElement) {
      this.divFormMovieElement.classList.add('display-block');
      this.addOption(this.categorySelectElement);

      if (this.formTitleElement) {
        if (movie) {
          this.formTitleElement.textContent = FORM_TITLES.movieFormEdit;

          if (this.titleElement) {
            this.titleElement.value = movie.title;
          }

          if (this.imageElement && this.imagePreviewElement) {
            this.imagePreviewElement.src = movie.image;
            this.imagePreviewElement.classList.add('display-block');
          }

          if (this.categoryElement) {
            this.categoryElement.value = movie.category.toLocaleLowerCase();
          }

          if (this.typeElement) {
            this.typeElement.value = movie.type;
          }

          if (this.yearElement) {
            this.yearElement.value = movie.release.toString();
          }

          if (this.videoElement && this.videoPreviewElement) {
            this.videoPreviewElement.src = movie.video;

            if (this.videoClosetElement) {
              this.videoClosetElement.classList.add('display-block');
            }
          }

          if (this.descriptionElement) {
            this.descriptionElement.value = movie.description;
          }

          this.formTitleElement.setAttribute('movie-id', movie.id.toString());
          this.formTitleElement.setAttribute('rating', movie.rating.toString());
          this.formTitleElement.setAttribute('favourites', movie.favourites.toString());
          this.formTitleElement.setAttribute('incompleteness', movie.incompleteness.toString());
        } else {
          this.formTitleElement.textContent = FORM_TITLES.movieFormCreate;
        }

        this.addKeydownFormMovie();
        this.closeFormByClickOutSide();
        this.changeInputFile();
        this.closeFormMovie();
      }
    }
  };

  /**
   * Update preview file in form movie.
   */
  private changeInputFile = () => {
    if (this.videoElement) {
      this.videoElement.addEventListener('change', () => {
        if (this.videoClosetElement) {
          this.videoClosetElement.classList.remove('display-block');
        }

        if (this.videoPreviewElement) {
          this.videoPreviewElement.src = '#';
        }
      });
    }

    if (this.imageElement) {
      this.imageElement.addEventListener('change', () => {
        if (this.imagePreviewElement) {
          this.imagePreviewElement.classList.remove('display-block');
          this.imagePreviewElement.src = '#';
        }
      });
    }
  };

  /**
   * Close form of movie.
   */
  private closeFormMovie = () => {
    this.cancelButtonFormElement = document.querySelector('#btn-movie-cancel');

    if (this.cancelButtonFormElement) {
      this.cancelButtonFormElement.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();

        if (this.formMovieElement) {
          this.formMovieElement.reset();
        }

        if (this.imagePreviewElement) {
          this.imagePreviewElement.src = '#';
          this.imagePreviewElement.classList.remove('display-block');
        }

        if (this.videoPreviewElement) {
          this.videoPreviewElement.src = '#';

          const videoParentElement = this.videoPreviewElement.closest('video');

          if (videoParentElement) {
            videoParentElement.classList.remove('display-block');
          }
        }

        if (this.divFormMovieElement) {
          this.divFormMovieElement.classList.remove('display-block');
        }

        if (this.categorySelectElement) {
          this.categorySelectElement.innerHTML = '';
        }

        if (this.formMovieElement) {
          this.formMovieElement.classList.remove('card-loading');
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

        if (this.imageElement) {
          this.imageElement.setAttribute('rules', 'required');
        }

        if (this.videoElement) {
          this.videoElement.setAttribute('rules', 'required');
        }
      });
    }
  };

  /**
   * Display form create movie.
   */
  displayUpdateMovieForm = (handler: (movieId: number) => void) => {
    this.trendingElement = document.querySelector('.trending-movie');

    if (this.trendingElement) {
      this.trendingMovieListElement =
        this.trendingElement.querySelectorAll<HTMLElement>('.card-img');

      if (this.trendingMovieListElement.length) {
        this.trendingMovieListElement.forEach((movieUpdateElement) => {
          movieUpdateElement.addEventListener('click', () => {
            let movieId: string | null = null;
            const parentFigureElement: HTMLElement | null = movieUpdateElement.closest('figure');

            if (parentFigureElement) {
              movieId = parentFigureElement.getAttribute('id');
            }

            if (movieId) {
              handler(parseInt(movieId));
            }

            if (this.imageElement) {
              this.imageElement.setAttribute('rules', '');
            }

            if (this.videoElement) {
              this.videoElement.setAttribute('rules', '');
            }
          });
        });
      }
    }
  };

  /**
   * Submit form movie.
   * @param {Function} handler - The submit event handler function.
   */
  getDataInMovieForm = (handler: (movie: Movie) => Promise<boolean | undefined>) => {
    if (this.divFormMovieElement) {
      this.submitButtonFormElement = this.divFormMovieElement.querySelector('.button-watch-movie');

      if (this.submitButtonFormElement) {
        this.submitButtonFormElement.addEventListener('click', async (event: MouseEvent) => {
          let isValidForm = false;
          if (this.divFormMovieElement && this.formMovieElement) {
            event.preventDefault();

            this.formMovieElement.classList.add('card-loading');

            resetErrors(this.divFormMovieElement);
            isValidForm = validateForm(this.divFormMovieElement);

            if (isValidForm) {
              if (this.formMovieElement) {
                const formData = new FormData(this.formMovieElement);
                const movie = await extractFormData(formData);

                if (this.formTitleElement) {
                  const movieId = this.formTitleElement.getAttribute('movie-id');
                  const rating = this.formTitleElement.getAttribute('rating');
                  const favourites = this.formTitleElement.getAttribute('favourites');
                  const incompleteness = this.formTitleElement.getAttribute('incompleteness');

                  if (rating) {
                    movie.rating = parseInt(rating);
                  }

                  if (favourites) {
                    movie.favourites = favourites.split(',').map((item) => parseInt(item));
                  }

                  if (incompleteness) {
                    movie.incompleteness = incompleteness.split(',').map((item) => parseInt(item));
                  }

                  if (movieId) {
                    movie.id = parseInt(movieId);

                    if (this.imagePreviewElement) {
                      if (this.imagePreviewElement.classList.contains('display-block')) {
                        movie.image = this.imagePreviewElement.src;
                      }
                    }

                    if (this.videoClosetElement && this.videoPreviewElement) {
                      if (this.videoClosetElement.classList.contains('display-block')) {
                        movie.video = this.videoPreviewElement.src;
                      }
                    }

                    const isSuccess = await handler(movie);

                    if (isSuccess && this.cancelButtonFormElement) {
                      this.cancelButtonFormElement.click();

                      if (this.categorySelectElement) {
                        this.categorySelectElement.innerHTML = '';
                      }
                    } else {
                      window.alert(ERROR_MESSAGES.create);
                    }
                  } else {
                    const isSuccess = await handler(movie);

                    if (isSuccess && this.cancelButtonFormElement) {
                      this.cancelButtonFormElement.click();

                      if (this.categorySelectElement) {
                        this.categorySelectElement.innerHTML = '';
                      }
                    } else {
                      window.alert(ERROR_MESSAGES.update);
                    }
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
  };

  /**
   * Close form movie when click outside form.
   */
  private closeFormByClickOutSide = () => {
    if (this.divFormMovieElement) {
      this.divFormMovieElement.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        if (targetElement.classList.contains('form-movie')) {
          if (this.cancelButtonFormElement) {
            this.cancelButtonFormElement.click();
          }
        }
      });
    }
  };

  /**
   * Add key down for form movie
   */
  private addKeydownFormMovie = () => {
    document.addEventListener('keydown', (event) => {
      const isEscape = event.key === 'Escape' || event.keyCode === 27;
      if (isEscape) {
        if (this.cancelButtonFormElement) {
          this.cancelButtonFormElement.click();
        }
      }

      const isEnter = event.key === 'Enter' || event.keyCode === 13;

      if (isEnter) {
        if (this.submitButtonFormElement) {
          this.submitButtonFormElement.click();
        }
      }
    });
  };
}
