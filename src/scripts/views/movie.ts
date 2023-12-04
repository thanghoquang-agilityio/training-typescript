import { resetErrors, validateForm, stringHelper, extractFormData } from '@/utils';

import { FORM_TITLES, NAVBAR_LIST } from '@/constants';

import { Category, FilteredMovieList } from '@/types';
import { IMovie, IMovieOptionalField } from '@/interfaces';

class Movie {
  private movieDetailElement: HTMLElement;
  private trendingElement: HTMLElement;
  private heartButtonMovieElement: NodeListOf<HTMLElement>;
  private movieDisplayedElement: HTMLElement;
  private movieListElement: NodeListOf<HTMLElement>;
  private heartButtonDetailElement: HTMLElement;
  private imageDetailElement: HTMLElement;
  private categoryNavbarElement: HTMLElement;
  private filterListElement: NodeListOf<HTMLElement>;
  private loadingElement: NodeListOf<HTMLElement>;
  private trendingMovieListElement: NodeListOf<HTMLElement>;

  // Element of Form
  private createMovieButtonElement: HTMLElement;
  private divFormMovieElement: HTMLElement;
  private formMovieElement: HTMLFormElement;
  private categorySelectElement: HTMLSelectElement;
  private formTitleElement: HTMLElement;
  private cancelButtonFormElement: HTMLElement;
  private submitButtonFormElement: HTMLElement;

  // Element of all field input in Form
  private titleElement: HTMLInputElement;
  private imageElement: HTMLInputElement;
  private categoryElement: HTMLInputElement;
  private typeElement: HTMLInputElement;
  private yearElement: HTMLInputElement;
  private videoElement: HTMLInputElement;
  private descriptionElement: HTMLInputElement;
  private imagePreviewElement: HTMLInputElement;
  private videoPreviewElement: HTMLInputElement;
  private videoClosetElement: HTMLElement;

  constructor() {
    // Initialize elements
    this.movieDetailElement = document.querySelector('.card-details') as HTMLElement;
    this.trendingElement = document.querySelector('.trending-now') as HTMLElement;
    this.heartButtonMovieElement = document.querySelectorAll<HTMLElement>('.button-heart-card');
    this.movieDisplayedElement = document.querySelector('.card-being-displayed') as HTMLElement;
    this.movieListElement = document.querySelectorAll<HTMLElement>('.card-img');
    this.heartButtonDetailElement = document.querySelector('.button-heart-movie') as HTMLElement;
    this.imageDetailElement = document.querySelector('.card-details-cover-image') as HTMLElement;
    this.categoryNavbarElement = document.querySelector('.navbar-categories') as HTMLElement;
    this.filterListElement = document.querySelectorAll<HTMLElement>('.text');
    this.loadingElement = document.querySelectorAll<HTMLElement>('.card-loading');
    this.trendingMovieListElement = document.querySelectorAll<HTMLElement>('.card-trending');

    this.createMovieButtonElement = document.querySelector('.create-movie') as HTMLElement;
    this.divFormMovieElement = document.querySelector('.form-movie') as HTMLElement;
    this.formMovieElement = document.getElementById('movie-form') as HTMLFormElement;
    this.categorySelectElement = document.getElementById('category') as HTMLSelectElement;
    this.formTitleElement = document.getElementById('movie-form-title') as HTMLElement;
    this.cancelButtonFormElement = document.getElementById('btn-movie-cancel') as HTMLElement;
    this.submitButtonFormElement = document.getElementById('btn-movie-save') as HTMLElement;

    this.titleElement = document.getElementById('title') as HTMLInputElement;
    this.imageElement = document.getElementById('image') as HTMLInputElement;
    this.categoryElement = document.getElementById('category') as HTMLInputElement;
    this.typeElement = document.getElementById('type') as HTMLInputElement;
    this.yearElement = document.getElementById('year-of-release') as HTMLInputElement;
    this.videoElement = document.getElementById('video') as HTMLInputElement;
    this.descriptionElement = document.getElementById('description') as HTMLInputElement;
    this.imagePreviewElement = document.getElementById('movie-image-preview') as HTMLInputElement;
    this.videoPreviewElement = document.getElementById('movie-video-preview') as HTMLInputElement;
    this.videoClosetElement = document.querySelector('video') as HTMLElement;
  }

  /**
   * Get movie Id when click heart button to the change favorites.
   * @param {Function} handleUpdateFavorites - The function update favorites.
   */
  getMovieIdByMovieButton = (
    handleUpdateFavorites: (id: number, typeOfFilter: keyof FilteredMovieList) => void,
  ) => {
    this.heartButtonMovieElement = document.querySelectorAll<HTMLElement>('.button-heart-card');

    this.heartButtonMovieElement.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const parentFigure = targetElement.closest('figure') as HTMLElement;
        const movieId = parentFigure.getAttribute('id');
        const classNameMovie = parentFigure.className.split(' ')[0];
        let typeOfFilter: keyof FilteredMovieList = 'trending';

        parentFigure.classList.add('card-loading');

        typeOfFilter = stringHelper.convertSnakeToCamel(
          classNameMovie.split('-').slice(1).join('-'),
        ) as keyof FilteredMovieList;

        if (movieId && typeOfFilter) {
          const id = parseInt(movieId);

          handleUpdateFavorites(id, typeOfFilter);
        }
      });
    });
  };

  /**
   * Add loading card movie when clicking favorite button in card movie
   */
  addLoadingMovieButton = () => {
    // Add loading when movie detail was displayed
    this.movieDetailElement.classList.add('card-details-loading');
    // Add prevent event for movie list
    this.trendingElement.classList.add('trending-now-loading');
    // Add prevent event for movie list
    this.trendingElement.classList.add('trending-now-loading');
  };

  /**
   * Add loading card movie when clicking favorite button in card details
   */
  addLoadingHeartButton = () => {
    this.movieDisplayedElement = document.querySelector('.card-being-displayed') as HTMLElement;
    // Add loading for movie card
    this.movieDisplayedElement.classList.add('card-loading');
    this.addLoadingMovieButton();
  };

  /**
   * Remove loading card movie when clicking favorite button
   * @param {string} movieId - The id of movie.
   */
  updateLoadingFavorites = (movieId: number) => {
    this.movieDisplayedElement = document.getElementById(movieId.toString()) as HTMLElement;
    // Re-render movie detail
    this.movieDisplayedElement.classList.add('card-being-displayed');
    // Remove loading when display movie was completed
    this.movieDetailElement.classList.remove('card-details-loading');
    // Remove prevent event for movie list
    this.trendingElement.classList.remove('trending-now-loading');
  };

  /**
   * Get movie Id when click movie card to show the details.
   * @param {Function} handleShowDetails - The function show movie details.
   */
  getMovieIdByMovieCard = (handleShowDetails: (id: number) => void) => {
    this.trendingElement = document.querySelector('.trending-now') as HTMLElement;
    this.movieListElement = this.trendingElement.querySelectorAll<HTMLElement>('.card-img');

    this.movieListElement.forEach((element: HTMLElement) => {
      element.addEventListener('click', async (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const parentFigureElement = targetElement.closest('figure') as HTMLElement;
        const movieId = parentFigureElement.getAttribute('id');

        if (!movieId) {
          return;
        }

        // Add loader when loading API
        this.movieDetailElement.classList.add('card-loading');
        this.movieDetailElement.innerHTML = '<span class="loader"></span>';
        // Disable heart button in list card and blur it
        this.trendingElement.classList.add('trending-now-loading');
        this.movieDisplayedElement = document.querySelector('.card-being-displayed') as HTMLElement;
        // Remove class in the movie card was selected last time
        if (this.movieDisplayedElement) {
          this.movieDisplayedElement.classList.remove('card-being-displayed');
        }

        const id = parseInt(movieId);

        await handleShowDetails(id);

        // Update style for movie was displayed
        parentFigureElement.classList.add('card-being-displayed');
        // Update style for movie list
        this.trendingElement.classList.remove('trending-now-loading');
        this.trendingElement.classList.add('trending-now-after-loading');
        // Update style for movie detail
        this.movieDetailElement.classList.remove('card-loading');
      });
    });
  };

  /**
   * Get movie Id when click heart button to the change favorites.
   * @param {Function} handleUpdateFavorites - The function update favorites.
   */
  getMovieIdByHeartButton = (handleUpdateFavorites: (id: number) => void) => {
    this.heartButtonDetailElement = document.querySelector('.button-heart-movie') as HTMLElement;

    this.heartButtonDetailElement.addEventListener('click', () => {
      const movieId = this.heartButtonDetailElement.getAttribute('id');

      if (movieId) {
        const id = parseInt(movieId);

        handleUpdateFavorites(id);
      }
    });
  };

  /**
   * Get image movie detail.
   */
  getImageDetailElement = (): boolean => {
    this.imageDetailElement = document.querySelector('.card-details-cover-image') as HTMLElement;

    if (this.imageDetailElement) {
      return true;
    }

    return false;
  };

  /**
   * Get category to filter movie list.
   * @param {Function} handleFilterMovie - The function filter movie.
   */
  filterMovie = (handleFilterMovie: (filter: Category) => void) => {
    this.categoryNavbarElement = document.querySelector('.navbar-categories') as HTMLElement;
    this.filterListElement = this.categoryNavbarElement.querySelectorAll<HTMLElement>('.text');

    this.filterListElement.forEach((filterElement: HTMLElement) => {
      filterElement.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const dataFilter = NAVBAR_LIST.find((item) => item.title === targetElement.textContent);

        if (dataFilter) {
          this.removeMovieDetail();
          this.addLoadingMovieList();

          handleFilterMovie(dataFilter.category as Category);
        }
      });
    });
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

    this.loadingElement.forEach((element: HTMLElement) => {
      element.classList.remove('card-loading');
    });
  };

  /**
   * Add loading when loading movie list.
   */
  private addLoadingMovieList = () => {
    this.loadingElement.forEach((element: HTMLElement) => {
      element.innerHTML = '<span class="loader"></span>';
      element.classList.add('card-loading');
    });
  };

  /**
   * Populate a <select> element with options based on a list of NAVBAR_LIST.
   * @param {HTMLSelectElement} selectElement - The <select> element to populate.
   */
  private addOption = (selectElement: HTMLSelectElement) => {
    NAVBAR_LIST.forEach((item) => {
      const option = document.createElement('option');

      option.textContent = item.title;
      option.value = item.category.toString();

      selectElement.appendChild(option);
    });
  };

  /**
   * Display form create of movie.
   * @param {Movie} movie - The movie may or may not be there.
   */
  displayFormMovie = (movie?: IMovie) => {
    this.categorySelectElement.innerHTML = '';
    this.divFormMovieElement.classList.add('display-block');
    this.addOption(this.categorySelectElement);

    if (movie) {
      this.formTitleElement.textContent = FORM_TITLES.movieFormEdit;
      this.formTitleElement.setAttribute('movie-id', movie.id.toString());
      this.titleElement.value = movie.title;
      this.imagePreviewElement.src = movie.image;
      this.imagePreviewElement.classList.add('display-block');
      this.categoryElement.value = movie.category.toLocaleLowerCase();
      this.typeElement.value = movie.type;
      this.yearElement.value = movie.release.toString();
      this.videoPreviewElement.src = movie.video;
      this.videoClosetElement.classList.add('display-block');
      this.descriptionElement.value = movie.description;
    } else {
      this.formTitleElement.setAttribute('movie-id', '');
      this.formTitleElement.textContent = FORM_TITLES.movieFormCreate;
    }

    this.addKeydownCloseFormMovie();
    this.closeFormByClickOutSide();
    this.changeInputFile();
    this.addCloseFormMovie();
  };

  /**
   * Update preview file in form movie.
   */
  private changeInputFile = () => {
    this.videoElement.addEventListener('change', () => {
      this.videoClosetElement.classList.remove('display-block');
      this.videoPreviewElement.src = '#';
    });

    this.imageElement.addEventListener('change', () => {
      this.imagePreviewElement.classList.remove('display-block');
      this.imagePreviewElement.src = '#';
    });
  };

  /**
   * Close form of movie.
   */
  closeForm = () => {
    this.formMovieElement.reset();

    this.imagePreviewElement.src = '#';
    this.imagePreviewElement.classList.remove('display-block');
    this.videoPreviewElement.src = '#';
    const videoParentElement = this.videoPreviewElement.closest('video') as HTMLVideoElement;
    videoParentElement.classList.remove('display-block');
    this.divFormMovieElement.classList.remove('display-block');
    this.formMovieElement.classList.remove('card-loading');

    resetErrors(this.divFormMovieElement);
  };

  /**
   * Add event for cancel button in form
   */
  private addCloseFormMovie = () => {
    this.cancelButtonFormElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();

      this.closeForm();
    });
  };

  /**
   * Display form create movie.
   */
  displayCreateMovieForm = () => {
    this.createMovieButtonElement.addEventListener('click', () => {
      this.displayFormMovie();
    });
  };

  /**
   * Display form create movie.
   */
  displayUpdateMovieForm = (handleShowMovieInForm: (movieId: number) => void) => {
    this.trendingElement = document.querySelector('.trending-movie') as HTMLElement;
    this.trendingMovieListElement = this.trendingElement.querySelectorAll<HTMLElement>('.card-img');

    this.trendingMovieListElement.forEach((movieUpdateElement) => {
      movieUpdateElement.addEventListener('click', () => {
        const parentFigureElement = movieUpdateElement.closest('figure') as HTMLElement;
        const movieId = parentFigureElement.getAttribute('id');

        if (movieId) {
          const id = parseInt(movieId);

          handleShowMovieInForm(id);
        }
      });
    });
  };

  /**
   * Submit form movie.
   */
  private checkMediaFileFormUpdate = () => {
    const isDisplayImage = this.imagePreviewElement?.classList.contains('display-block');
    const isDisplayVideo = this.videoClosetElement?.classList.contains('display-block');

    if (isDisplayImage) this.imageElement?.setAttribute('rules', '');
    else this.imageElement?.setAttribute('rules', 'required');

    if (this.videoElement && isDisplayVideo) this.videoElement.setAttribute('rules', '');
    else this.videoElement?.setAttribute('rules', 'required');
  };

  /**
   * Submit form movie.
   * @param {Function} handleSubmit - The submit event function.
   */
  getDataInMovieForm = (handleSubmit: (movie: IMovieOptionalField) => void) => {
    if (!this.submitButtonFormElement) {
      return;
    }

    this.submitButtonFormElement.addEventListener('click', async (event: MouseEvent) => {
      event.preventDefault();

      resetErrors(this.formMovieElement);
      this.formMovieElement.classList.add('card-loading');
      this.checkMediaFileFormUpdate();

      const isValidForm = validateForm(this.formMovieElement);

      if (isValidForm) {
        const formData = new FormData(this.formMovieElement);
        const movie = await extractFormData(formData);
        const movieId = this.formTitleElement.getAttribute('movie-id');

        if (movieId) {
          movie.id = parseInt(movieId);
          await handleSubmit(movie);
        } else {
          await handleSubmit(movie);
        }
      }

      this.formMovieElement.classList.remove('card-loading');
    });
  };

  /**
   * Close form movie when click outside form.
   */
  private closeFormByClickOutSide = () => {
    this.divFormMovieElement.addEventListener('click', (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement;

      if (targetElement.classList.contains('form-movie')) {
        this.closeForm();
      }
    });
  };

  /**
   * Add key down for form movie
   */
  private addKeydownCloseFormMovie = () => {
    document.addEventListener('keydown', (event) => {
      const isEscape = event.key === 'Escape' || event.keyCode === 27;

      if (isEscape) {
        this.closeForm();
      }
    });
  };
}

export default Movie;
