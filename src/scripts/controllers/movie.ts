import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/templates';
import { Movie, MovieData } from '@/interfaces';
import { MovieGenre, StatusCode } from '@/enums';
import { ROUTES, USER_ID, MOVIE_FIELD, TOP_TRENDING_LIMIT } from '@/constants';

export class MovieController {
  model: MovieModel;
  view: MovieView;
  movieData: MovieData;
  pathname: string;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;
    this.movieData = {
      trending: [],
      favourites: [],
      continueWatching: [],
    };

    this.pathname = window.location.pathname;

    renderSidebar(this.pathname);
    renderNavbar();

    this.initData(this.pathname);
  }

  private initData = async (path: string) => {
    let response;

    switch (path) {
      case ROUTES.homePage:
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.incompleteness,
          value: USER_ID,
          like: true,
        });

        if (response.status === StatusCode.Ok) {
          this.movieData.continueWatching = response.data;
        }

        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        if (response.status === StatusCode.Ok) {
          this.movieData.trending = response.data;
        }

        break;

      case ROUTES.favouritesPage:
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.favourites,
          value: USER_ID,
          like: true,
        });

        if (response.status === StatusCode.Ok) {
          this.movieData.favourites = response.data;
        }

        break;

      case ROUTES.trendingPage:
      default: {
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        if (response.status === StatusCode.Ok) {
          this.movieData.trending = response.data;
        }

        break;
      }
    }

    this.displayMovieList(path);
  };

  private displayMovieList = async (path: string) => {
    switch (path) {
      case ROUTES.homePage:
        renderMovieList(this.movieData.trending, MovieGenre.Trending);
        renderMovieList(this.movieData.continueWatching, MovieGenre.ContinueWatching);

        this.view.getMovieIdByMovieButton(this.updateFavourites);
        break;

      case ROUTES.favouritesPage:
        renderMovieList(this.movieData.favourites, MovieGenre.Favourites);

        this.view.getMovieIdByMovieButton(this.removeMovieInFavourites);
        break;

      case ROUTES.trendingPage:
      default: {
        renderMovieList(this.movieData.trending, MovieGenre.Trending);

        this.view.getMovieIdByMovieButton(this.updateFavouritesTrending);
        this.view.getMovieIdByMovieCard(this.displayMovieDetail);
        break;
      }
    }
  };

  /**
   * Handles the change of favourites movie
   * @param {string} movieId - The ID of the movie to be updated in favourites page.
   */
  private updateFavourites = async (movieId: string, movieGenre: keyof MovieData) => {
    const movie: Movie | undefined = this.movieData[movieGenre].find(
      (movie: Movie) => movie.id.toString() === movieId,
    );
    let favourites: string[] = [];

    if (movie) {
      favourites = movie.favourites;
    }

    // Check like or dislike movie
    if (favourites.includes(USER_ID)) {
      favourites = favourites.filter((item) => !USER_ID.includes(item));
    } else {
      if (favourites.length) {
        favourites = [USER_ID];
      } else {
        favourites.push(USER_ID);
      }
    }

    if (movie) {
      movie.favourites = favourites;

      // Call API update favourites
      const response = await this.model.updateMovie(movieId, movie);

      // Check update success or failed for update movie data
      if (response.status === StatusCode.Ok && movieGenre !== MovieGenre.Favourites) {
        this.movieData[movieGenre].forEach((movie: Movie) => {
          if (movie.id.toString() === movieId) {
            movie.favourites = favourites;
          }
        });

        this.displayMovieList(this.pathname);
      }
    }
  };

  /**
   * Handles the deletion of a movie in favourites page.
   * @param {string} movieId - The ID of the movie to be removed in favourites page.
   */
  private removeMovieInFavourites = async (movieId: string, movieGenre: keyof MovieData) => {
    await this.updateFavourites(movieId, movieGenre);

    this.movieData.favourites = this.movieData.favourites.filter(
      (movie) => movie.id.toString() !== movieId,
    );

    this.displayMovieList(this.pathname);
  };

  /**
   * Handles the display movie detail
   * @param {string} movieId - The ID of the movie to be displayed detail in trending page.
   */
  private displayMovieDetail = async (movieId: string) => {
    // Call API get movie by id
    const response = await this.model.getMovieById(movieId);

    if (response.status === StatusCode.Ok) {
      renderMovieDetail(response.data);
    }
  };

  /**
   * Handles the change of favourites movie
   * @param {string} movieId - The ID of the movie to be updated in favourites page.
   */
  private updateFavouritesTrending = async (movieId: string, movieGenre: keyof MovieData) => {
    this.view.addLoadingForMovieDetail();
    await this.updateFavourites(movieId, movieGenre);

    const imageDetailElement: HTMLElement | null = document.querySelector(
      '.card-details-cover-image',
    );

    // Check movie detail was displayed
    if (imageDetailElement) {
      const movie = this.movieData.trending.find((movie: Movie) => movie.id.toString() === movieId);

      if (movie) {
        renderMovieDetail(movie);
      }

      this.view.updateLoadingForMovieDetail(movieId);
    }
  };
}
