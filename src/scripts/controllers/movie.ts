import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/templates';
import { Movie } from '@/interfaces';
import { disableElement, enableElement } from '@/utils/prevent';
import { MovieGenre } from '@/enums';
import { ROUTES, USER_ID, MOVIE_FIELD, TOP_TRENDING_LIMIT } from '@/constants';

export class MovieController {
  model: MovieModel;
  view: MovieView;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;

    const pathname = window.location.pathname;

    renderSidebar(pathname);
    renderNavbar();

    this.displayMovieList(pathname);
  }

  private displayMovieList = async (path: string) => {
    let trendingMovieList: Movie[] = [];

    switch (path) {
      case ROUTES.homePage:
        trendingMovieList = await this.model.getMovieList(TOP_TRENDING_LIMIT);
        const continueWatchingMovieList = await this.model.getMoviesByField(
          MOVIE_FIELD.incompleteness,
          USER_ID,
        );

        renderMovieList(trendingMovieList, MovieGenre.Trending);
        renderMovieList(continueWatchingMovieList, MovieGenre.ContinueWatching);
        break;

      case ROUTES.favouritesPage:
        const favouritesMovieList = await this.model.getMoviesByField(
          MOVIE_FIELD.favourites,
          USER_ID,
        );

        renderMovieList(favouritesMovieList, MovieGenre.Favourites);
        break;

      case ROUTES.trendingPage:
      default: {
        trendingMovieList = await this.model.getMovieList(TOP_TRENDING_LIMIT);

        renderMovieList(trendingMovieList, MovieGenre.Trending);
        break;
      }
    }

    this.view.bindAddFavouritesEvent(this.updateMovieInFavourites);
  };

  /**
   * Handles the addition of a movie.
   * @param {string} movieId - The ID of the movie to be updated in favourites page.
   * @param {boolean} isCreated - It's true, data will be added. It's false, data will be removed.
   */
  private updateMovieInFavourites = async (
    movieId: string,
    isCreated: boolean,
    targetElement: HTMLElement,
  ) => {
    disableElement('button');
    disableElement('a');

    const currentMovie = await this.model.getMovieById(movieId);
    const favouritesList = currentMovie.favourites;
    let updatedFavouritesList: string = '';

    if (isCreated && !favouritesList) {
      updatedFavouritesList = USER_ID;
    } else if (isCreated && favouritesList) {
      updatedFavouritesList = `${favouritesList},${USER_ID}`;
    }

    const data = {
      favourites: updatedFavouritesList,
    };

    const response = await this.model.updateMovie(movieId, data);

    if (response.favourites.includes(USER_ID)) {
      let iconButtonMovie = targetElement.closest('img');
      const buttonAddMovie = targetElement.closest('button');

      if (!iconButtonMovie) iconButtonMovie = targetElement.querySelector('img');

      if (iconButtonMovie) {
        iconButtonMovie.setAttribute('src', './icons/heart-full.svg');

        if (buttonAddMovie) {
          buttonAddMovie.classList.remove('add-movie-into-favourites');
          buttonAddMovie.classList.add('remove-movie-from-favourites');
        }
      }
    }
  };
}
