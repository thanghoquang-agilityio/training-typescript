import {
  ROUTES,
  DEFAULT_LOGGED_USER_ID,
  MOVIE_FIELD_PAYLOAD,
  TOP_TRENDING_LIMIT,
} from '@/constants';
import { TypeOfFilter } from '@/enums';

import { Category, FilteredMovieList, Path } from '@/types';
import { IMovie, IMovieOptionalField } from '@/interfaces';

import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/renders';

import MovieModel from '@/models/movie';
import MovieView from '@/views/movie';

class Movie {
  model: MovieModel;
  view: MovieView;
  movieList: FilteredMovieList;
  pathname: Path;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;
    this.movieList = {
      trending: [],
      favorites: [],
      continueWatching: [],
    };

    this.pathname = window.location.pathname as Path;
    this.initData(this.pathname);

    renderSidebar(this.pathname);
    renderNavbar();

    this.view.filterMovie(this.filterMovieList);
    this.view.getDataInMovieForm(this.submitMovieForm);
  }

  /**
   * Handles create data of the page is displayed
   * @param {string} path - The page is displayed.
   * @returns {Promise<void>}
   */
  private initData = async (path: Path): Promise<void> => {
    switch (path) {
      case ROUTES.homePage: {
        this.movieList.continueWatching = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.incompleteness,
          value: DEFAULT_LOGGED_USER_ID,
          like: true,
        });

        this.movieList.trending = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        break;
      }

      case ROUTES.favoritesPage: {
        this.movieList.favorites = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.favorites,
          value: DEFAULT_LOGGED_USER_ID,
          like: true,
        });

        break;
      }

      case ROUTES.trendingPage: {
        this.movieList.trending = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        break;
      }
    }

    this.displayMovieList(path);
  };

  /**
   * Handles render data of the page is displayed
   * @param {string} path - The page is displayed.
   * @returns {void}
   */
  private displayMovieList = (path: Path): void => {
    switch (path) {
      case ROUTES.homePage: {
        renderMovieList(this.movieList.trending, TypeOfFilter.Trending);
        renderMovieList(this.movieList.continueWatching, TypeOfFilter.ContinueWatching);

        this.view.getMovieIdByMovieButton(this.updateFavorites);
        this.view.displayCreateMovieForm();
        this.view.displayUpdateMovieForm(this.displayMovieUpdate);

        break;
      }

      case ROUTES.favoritesPage: {
        renderMovieList(this.movieList.favorites, TypeOfFilter.Favorites);

        this.view.getMovieIdByMovieButton(this.removeMovieInFavorites);

        break;
      }

      case ROUTES.trendingPage: {
        renderMovieList(this.movieList.trending, TypeOfFilter.Trending);

        this.view.getMovieIdByMovieButton(this.updateFavoritesTrending);
        this.view.getMovieIdByMovieCard(this.displayMovieDetail);

        break;
      }
    }

    this.view.removeLoading();
  };

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @param {FilteredMovieList} typeOfFilter - The type of the movie.
   * @returns {Promise<boolean>} A promise status success or fail
   */
  private updateFavorites = async (
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<boolean> => {
    const movie = this.movieList[typeOfFilter].find((movie: IMovie) => movie.id === movieId);

    if (!movie) {
      return false;
    }

    let favorites: number[] = movie.favorites;

    // Update data in favourites
    if (favorites.includes(DEFAULT_LOGGED_USER_ID)) {
      favorites = favorites.filter((item) => DEFAULT_LOGGED_USER_ID !== item);
    } else {
      if (!favorites.length) {
        favorites = [DEFAULT_LOGGED_USER_ID];
      } else {
        favorites.push(DEFAULT_LOGGED_USER_ID);
      }
    }

    movie.favorites = favorites;

    // Call API update favorites
    const updatedMovie = await this.model.update(movieId, movie);

    if (!updatedMovie?.id) {
      return false;
    }

    if (typeOfFilter !== TypeOfFilter.Favorites) {
      this.movieList.trending.forEach((movie: IMovie) => {
        if (movie.id === movieId) {
          movie.favorites = favorites;
        }
      });

      this.movieList.continueWatching.forEach((movie: IMovie) => {
        if (movie.id === movieId) {
          movie.favorites = favorites;
        }
      });

      this.displayMovieList(this.pathname);
    }

    return true;
  };

  /**
   * Handles the deletion of a movie in favorites page.
   * @param {number} movieId - The ID of the movie to be removed in favorites page.
   * @param {FilteredMovieList} typeOfFilter - The type of the movie.
   * @returns {Promise<void>}
   */
  private removeMovieInFavorites = async (
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<void> => {
    const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

    if (isSuccess) {
      this.movieList.favorites = this.movieList.favorites.filter((movie) => movie.id !== movieId);

      this.displayMovieList(this.pathname);
    }
  };

  /**
   * Handles the display movie detail
   * @param {number} movieId - The ID of the movie to be displayed detail in trending page.
   * @returns {Promise<void>}
   */
  private displayMovieDetail = async (movieId: number): Promise<void> => {
    // Call API get movie by id
    const movie = await this.model.getById(movieId);

    if (movie?.id) {
      this.renderDetail(movie);
    }
  };

  /**
   * Handles render data of the movie is displayed
   * @param {Movie} movie - The movie is displayed.
   * @returns {void}
   */
  private renderDetail = (movie: IMovie): void => {
    renderMovieDetail(movie);

    this.view.getMovieIdByHeartButton(this.updateFavoriteDetail);
  };

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @returns {Promise<void>}
   */
  private updateFavoritesTrending = async (
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<void> => {
    const hasDetail: boolean = this.view.getImageDetailElement();

    if (hasDetail) {
      const movie = this.movieList.trending.find((movie: IMovie) => movie.id === movieId);

      this.view.addLoadingMovieButton();
      const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

      if (!isSuccess) {
        return;
      }

      if (movie) {
        this.renderDetail(movie);
      }

      this.view.updateLoadingFavorites(movieId);
    } else {
      await this.updateFavorites(movieId, typeOfFilter);
    }
  };

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @returns {Promise<void>}
   */
  private updateFavoriteDetail = async (movieId: number): Promise<void> => {
    const typeOfFilter: keyof FilteredMovieList = TypeOfFilter.Trending;
    const movie = this.movieList[typeOfFilter].find((movie: IMovie) => movie.id === movieId);

    this.view.addLoadingHeartButton();

    const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

    if (!isSuccess) {
      return;
    }

    if (movie) {
      this.renderDetail(movie);
    }

    this.view.updateLoadingFavorites(movieId);
  };

  /**
   * Handles the filter of movie data
   * @param {string} filterValue - category was clicked.
   * @returns {Promise<void>}
   */
  private filterMovieList = async (filterValue: Category): Promise<void> => {
    switch (this.pathname) {
      case ROUTES.homePage: {
        const movieContinueWatching = await this.model.filter({
          category: filterValue,
          incompleteness: DEFAULT_LOGGED_USER_ID,
        });

        this.movieList.continueWatching = movieContinueWatching || [];

        const movieTrending = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.category,
          value: filterValue,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        this.movieList.trending = movieTrending || [];

        break;
      }

      case ROUTES.favoritesPage: {
        const movieFavorites = await this.model.filter({
          category: filterValue,
          favorites: DEFAULT_LOGGED_USER_ID,
        });

        this.movieList.favorites = movieFavorites || [];

        break;
      }

      case ROUTES.trendingPage: {
        const movieTrending = await this.model.getListByField({
          field: MOVIE_FIELD_PAYLOAD.category,
          value: filterValue,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        this.movieList.trending = movieTrending || [];

        break;
      }
    }

    this.displayMovieList(this.pathname);
  };

  /**
   * Handles the display movie in form
   * @param {number} movieId - The ID of the movie to be displayed detail in form.
   * @returns {Promise<void>}
   */
  private displayMovieUpdate = async (movieId: number): Promise<void> => {
    // Call API get movie by id
    const movieIndex = this.movieList.trending.findIndex((movie: IMovie) => movie.id === movieId);
    const movie = this.movieList.trending[movieIndex];

    this.view.displayFormMovie(movie);
  };

  /**
   * Handles submit form movie
   * @param {Movie} movie - data from form.
   * @returns {Promise<void>}
   */
  submitMovieForm = async (movie: IMovieOptionalField): Promise<void> => {
    if (movie.id) {
      const updatedMovie = await this.model.update(movie.id, movie);

      if (!updatedMovie?.id) {
        return;
      }

      if (updatedMovie.isTrending) {
        const movieIndex = this.movieList.trending.findIndex(
          (movie: IMovie) => movie.id === updatedMovie?.id,
        );

        this.movieList.trending[movieIndex] = updatedMovie;
      } else {
        this.movieList.trending = this.movieList.trending.filter(
          (item) => item.id !== updatedMovie?.id,
        );
      }

      this.displayMovieList(this.pathname);
    } else {
      const createdMovie = await this.model.create(movie);

      if (!createdMovie?.id) {
        return;
      }

      if (createdMovie.isTrending) {
        if (this.movieList.trending.length > TOP_TRENDING_LIMIT) {
          this.movieList.trending.pop();
        }

        this.movieList.trending.push(createdMovie);
        this.displayMovieList(this.pathname);
      }
    }

    this.view.closeForm();
  };
}

export default Movie;
