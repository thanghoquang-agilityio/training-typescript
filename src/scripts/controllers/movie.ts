import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/templates';
import { Movie, MovieData } from '@/interfaces';
import { MovieGenre, HttpStatusCodes } from '@/enums';
import { Category } from '@/types';
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

    this.view.filterMovie(this.filterMovieData);
    this.initData(this.pathname);
  }

  /**
   * Handles create data of the page is displayed
   * @param {string} path - The page is displayed.
   */
  private initData = async (path: string) => {
    let response;

    switch (path) {
      case ROUTES.homePage:
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.incompleteness,
          value: USER_ID,
          like: true,
        });

        if (response.status === HttpStatusCodes.OK) {
          this.movieData.continueWatching = response.data;
        }

        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        if (response.status === HttpStatusCodes.OK) {
          this.movieData.trending = response.data;
        }

        break;

      case ROUTES.favouritesPage:
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD.favourites,
          value: USER_ID,
          like: true,
        });

        if (response.status === HttpStatusCodes.OK) {
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

        if (response.status === HttpStatusCodes.OK) {
          this.movieData.trending = response.data;
        }

        break;
      }
    }

    this.displayMovieList(path);
  };

  /**
   * Handles render data of the page is displayed
   * @param {string} path - The page is displayed.
   */
  private displayMovieList = async (path: string) => {
    switch (path) {
      case ROUTES.homePage:
        renderMovieList(this.movieData.trending, MovieGenre.Trending);
        renderMovieList(this.movieData.continueWatching, MovieGenre.ContinueWatching);

        this.view.getMovieIdByMovieButton(this.updateFavourites);
        this.view.displayCreateMovieForm();
        this.view.displayUpdateMovieForm(this.displayMovieUpdate);
        this.view.getDataInMovieForm(this.submitMovieForm);
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

    this.view.removeLoading();
  };

  /**
   * Handles the change of favourites movie
   * @param {number} movieId - The ID of the movie to be updated in favourites page.
   * @param {MovieData} movieGenre - The type of the movie.
   */
  private updateFavourites = async (movieId: number, movieGenre: keyof MovieData) => {
    const movie: Movie | undefined = this.movieData[movieGenre].find(
      (movie: Movie) => movie.id === movieId,
    );
    let favourites: number[] = [];

    if (movie) {
      favourites = movie.favourites;
    }

    // Check like or dislike movie
    if (favourites.includes(USER_ID)) {
      favourites = favourites.filter((item) => USER_ID !== item);
    } else {
      if (!favourites.length) {
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
      if (response.status === HttpStatusCodes.OK && movieGenre !== MovieGenre.Favourites) {
        this.movieData[movieGenre].forEach((movie: Movie) => {
          if (movie.id === movieId) {
            movie.favourites = favourites;
          }
        });

        this.displayMovieList(this.pathname);
      }
    }
  };

  /**
   * Handles the deletion of a movie in favourites page.
   * @param {number} movieId - The ID of the movie to be removed in favourites page.
   * @param {MovieData} movieGenre - The type of the movie.
   */
  private removeMovieInFavourites = async (movieId: number, movieGenre: keyof MovieData) => {
    await this.updateFavourites(movieId, movieGenre);

    this.movieData.favourites = this.movieData.favourites.filter((movie) => movie.id !== movieId);

    this.displayMovieList(this.pathname);
  };

  /**
   * Handles the display movie detail
   * @param {number} movieId - The ID of the movie to be displayed detail in trending page.
   */
  private displayMovieDetail = async (movieId: number) => {
    // Call API get movie by id
    const response = await this.model.getMovieById(movieId);

    if (response.status === HttpStatusCodes.OK) {
      this.renderDetail(response.data);
    }
  };

  /**
   * Handles render data of the movie is displayed
   * @param {Movie} movie - The movie is displayed.
   */
  private renderDetail = (movie: Movie) => {
    renderMovieDetail(movie);

    this.view.getMovieIdByHeartButton(this.updateFavouriteDetail);
  };

  /**
   * Handles the change of favourites movie
   * @param {number} movieId - The ID of the movie to be updated in favourites page.
   */
  private updateFavouritesTrending = async (movieId: number, movieGenre: keyof MovieData) => {
    const hasDetail: boolean = this.view.getImageDetailElement();

    if (hasDetail) {
      const movie = this.movieData.trending.find((movie: Movie) => movie.id === movieId);

      this.view.addLoadingMovieButton();
      await this.updateFavourites(movieId, movieGenre);

      if (movie) {
        this.renderDetail(movie);
      }

      this.view.updateLoadingFavourites(movieId);
    } else {
      await this.updateFavourites(movieId, movieGenre);
    }
  };

  /**
   * Handles the change of favourites movie
   * @param {number} movieId - The ID of the movie to be updated in favourites page.
   */
  private updateFavouriteDetail = async (movieId: number) => {
    const movieGenre: keyof MovieData = MovieGenre.Trending;
    const movie: Movie | undefined = this.movieData[movieGenre].find(
      (movie: Movie) => movie.id === movieId,
    );

    this.view.addLoadingHeartButton();

    await this.updateFavourites(movieId, movieGenre);

    if (movie) {
      this.renderDetail(movie);
    }

    this.view.updateLoadingFavourites(movieId);
  };

  /**
   * Handles the filter of movie data
   * @param {string} filterValue - category was clicked.
   * For example, the movie filter has a category of Series,...
   */
  private filterMovieData = async (filterValue: string) => {
    let response;

    const category: Category = filterValue as Category;

    switch (this.pathname) {
      case ROUTES.homePage:
        response = await this.model.filterMovies({ category: category, incompleteness: USER_ID });

        if (response.status === HttpStatusCodes.OK) {
          this.movieData.continueWatching = response.data;
        }

        if (filterValue) {
          response = await this.model.getMoviesByField({
            field: MOVIE_FIELD.category,
            value: filterValue,
            like: false,
            limit: TOP_TRENDING_LIMIT,
          });

          if (response.status === HttpStatusCodes.OK) {
            this.movieData.trending = response.data;
          }
        }

        break;

      case ROUTES.favouritesPage:
        response = await this.model.filterMovies({ category: category, favourites: USER_ID });

        if (response.status === HttpStatusCodes.OK) {
          this.movieData.favourites = response.data;
        }

        break;

      case ROUTES.trendingPage:
      default:
        if (filterValue) {
          response = await this.model.getMoviesByField({
            field: MOVIE_FIELD.category,
            value: filterValue,
            like: false,
            limit: TOP_TRENDING_LIMIT,
          });

          if (response.status === HttpStatusCodes.OK) {
            this.movieData.trending = response.data;
          }
        }

        break;
    }

    this.displayMovieList(this.pathname);
  };

  /**
   * Handles the display movie in form
   * @param {number} movieId - The ID of the movie to be displayed detail in form.
   */
  private displayMovieUpdate = async (movieId: number) => {
    // Call API get movie by id
    const movieIndex = this.movieData.trending.findIndex((movie: Movie) => movie.id === movieId);
    const movie = this.movieData.trending[movieIndex];

    this.view.displayFormMovie(movie);
  };

  /**
   * Handles submit form movie
   * @param {Movie} movie - data from form.
   * @returns {Promise<boolean | undefined>}  A promise resolving to the boolean.
   */
  submitMovieForm = async (movie: Movie): Promise<boolean | undefined> => {
    if (movie.id) {
      const response = await this.model.updateMovie(movie.id, movie);

      if (response.status === HttpStatusCodes.OK) {
        if (response.data.isTrending) {
          const movieIndex = this.movieData.trending.findIndex(
            (movie: Movie) => movie.id === response.data.id,
          );

          this.movieData.trending[movieIndex] = response.data;
        } else {
          this.movieData.trending = this.movieData.trending.filter(
            (item) => item.id !== response.data.id,
          );
        }

        this.displayMovieList(this.pathname);

        return true;
      }
    } else {
      const response = await this.model.createMovie(movie);

      if (response.status === HttpStatusCodes.Created) {
        if (response.data.isTrending) {
          if (this.movieData.trending.length > TOP_TRENDING_LIMIT) {
            this.movieData.trending.pop();
          }

          this.movieData.trending.push(response.data);

          this.displayMovieList(this.pathname);
        }

        return true;
      }
    }
  };
}
