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

        this.view.bindAddOrRemoveFavouritesEvent(this.updateMovieInFavourites);
        break;

      case ROUTES.favouritesPage:
        const favouritesMovieList = await this.model.getMoviesByField(
          MOVIE_FIELD.favourites,
          USER_ID,
          true,
        );

        renderMovieList(favouritesMovieList, MovieGenre.Favourites);

        this.view.bindAddOrRemoveFavouritesEvent(this.removeMovieInFavourites);
        break;

      case ROUTES.trendingPage:
      default: {
        trendingMovieList = await this.model.getMovieList(TOP_TRENDING_LIMIT);

        renderMovieList(trendingMovieList, MovieGenre.Trending);

        this.view.bindAddOrRemoveFavouritesEvent(this.updateMovieInFavourites);
        break;
      }
    }
  };

  /**
   * Handles the addition of a movie.
   * @param {string} movieId - The ID of the movie to be updated in favourites page.
   * @param {HTMLElement} targetElement - The movie was clicked.
   */
  private updateMovieInFavourites = async (
    movieId: string,
    favouritesList: string[],
    targetElement: HTMLElement,
  ) => {
    const parentFigure = targetElement.closest('figure') as HTMLElement;

    parentFigure.classList.add('card-loading');

    let updatedFavouritesList: string[] = favouritesList;

    // Check like or dislike movie
    if (favouritesList.includes(USER_ID)) {
      updatedFavouritesList = favouritesList.filter((item) => !USER_ID.includes(item));
    } else {
      if (!updatedFavouritesList) {
        updatedFavouritesList = [USER_ID];
      } else {
        favouritesList.push(USER_ID);
        updatedFavouritesList = favouritesList;
      }
    }

    const data = {
      favourites: updatedFavouritesList,
    };

    // Call API update favourites
    const response = await this.model.updateMovie(movieId, data);
    let iconButtonMovie = targetElement.closest('img');

    if (!iconButtonMovie) iconButtonMovie = targetElement.querySelector('img');

    console.log(iconButtonMovie);

    // Check update success or failed
    if (iconButtonMovie) {
      if (response.favourites.includes(USER_ID)) {
        iconButtonMovie.setAttribute('src', './icons/heart-full.svg');
      } else {
        iconButtonMovie.setAttribute('src', './icons/heart.svg');
      }
      parentFigure.setAttribute('data-favourites', response.favourites.join(','));
    }

    parentFigure.classList.remove('card-loading');
  };

  /**
   * Handles the deletion of a movie.
   * @param {string} movieId - The ID of the movie to be removed in favourites page.
   * @param {HTMLElement} targetElement - The movie was clicked.
   */
  private removeMovieInFavourites = async (
    movieId: string,
    favouritesList: string[],
    targetElement: HTMLElement,
  ) => {
    await this.updateMovieInFavourites(movieId, favouritesList, targetElement);

    const favouritesMovieList = await this.model.getMoviesByField(
      MOVIE_FIELD.favourites,
      USER_ID,
      true,
    );

    renderMovieList(favouritesMovieList, MovieGenre.Favourites);

    this.view.bindAddOrRemoveFavouritesEvent(this.removeMovieInFavourites);
  };
}
