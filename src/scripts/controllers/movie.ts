import { showAlertMessage } from '@/utils';

import {
  ROUTES,
  DEFAULT_LOGGED_USER_ID,
  MOVIE_FIELD_PAYLOAD,
  TOP_TRENDING_LIMIT,
  ERROR_MESSAGES,
} from '@/constants';
import { TypeOfFilter } from '@/enums';

import { Category, FilteredMovieList, MoviePage, Path } from '@/types';
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

    // Init data for all page
    this.initData = this.initData.bind(this);
    this.filterMovieList = this.filterMovieList.bind(this);

    // Homepage
    this.updateFavorites = this.updateFavorites.bind(this);
    this.submitMovieForm = this.submitMovieForm.bind(this);
    this.displayMovieUpdate = this.displayMovieUpdate.bind(this);

    // Favorites page
    this.removeMovieInFavorites = this.removeMovieInFavorites.bind(this);

    // Trending page
    this.displayMovieDetail = this.displayMovieDetail.bind(this);
    this.updateFavoritesTrending = this.updateFavoritesTrending.bind(this);
    this.updateFavoriteDetail = this.updateFavoriteDetail.bind(this);

    this.displayInitData(this.pathname, this.initData);

    renderSidebar(this.pathname);
    renderNavbar();

    this.view.filterMovie(this.filterMovieList);
    this.view.getDataInMovieForm(this.submitMovieForm);
  }

  /**
   * Handles init movie list in home page
   * @returns {Promise<void>}
   */
  private async initHomePage(): Promise<void> {
    const responseContinueWatching = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.incompleteness,
      value: DEFAULT_LOGGED_USER_ID,
      like: true,
    });

    if (responseContinueWatching.code) {
      showAlertMessage(responseContinueWatching.code);
      return;
    }

    this.movieList.continueWatching = responseContinueWatching.data;

    const responseTrending = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.isTrending,
      value: true,
      like: false,
      limit: TOP_TRENDING_LIMIT,
    });

    if (responseTrending.code) {
      showAlertMessage(responseTrending.code);
      return;
    }

    this.movieList.trending = responseTrending.data;
  }

  /**
   * Handles init movie list in favorites page
   * @returns {Promise<void>}
   */
  private async initFavoritesPage(): Promise<void> {
    const responseFavorites = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.favorites,
      value: DEFAULT_LOGGED_USER_ID,
      like: true,
    });

    if (responseFavorites.code) {
      showAlertMessage(responseFavorites.code);
      return;
    }

    this.movieList.favorites = responseFavorites.data;
  }

  /**
   * Handles init movie list in trending page
   * @returns {Promise<void>}
   */
  private async initTrendingPage(): Promise<void> {
    const responseTrending = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.isTrending,
      value: true,
      like: false,
      limit: TOP_TRENDING_LIMIT,
    });

    if (responseTrending.code) {
      showAlertMessage(responseTrending.code);
      return;
    }

    this.movieList.trending = responseTrending.data;
  }

  /**
   * Handles the filter of movie list in home page
   * @param {Category} filterValue - category was clicked.
   * @returns {Promise<void>}
   */
  private async filterHomePage(filterValue: Category): Promise<void> {
    const responseContinueWatching = await this.model.filter({
      category: filterValue,
      incompleteness: DEFAULT_LOGGED_USER_ID,
    });

    if (responseContinueWatching.code) {
      showAlertMessage(responseContinueWatching.code);
      return;
    }

    this.movieList.continueWatching = responseContinueWatching.data;

    const responseTrending = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.category,
      value: filterValue,
      like: false,
      limit: TOP_TRENDING_LIMIT,
    });

    if (responseTrending.code) {
      showAlertMessage(responseTrending.code);
      return;
    }

    this.movieList.trending = responseTrending.data;
  }

  /**
   * Handles the filter of movie list in favorites page
   * @param {Category} filterValue - category was clicked.
   * @returns {Promise<void>}
   */
  private async filterFavoritesPage(filterValue: Category): Promise<void> {
    const responseFavorites = await this.model.filter({
      category: filterValue,
      favorites: DEFAULT_LOGGED_USER_ID,
    });

    if (responseFavorites.code) {
      showAlertMessage(responseFavorites.code);
      return;
    }

    this.movieList.favorites = responseFavorites.data;
  }

  /**
   * Handles the filter of movie list in trending page
   * @param {Category} filterValue - category was clicked.
   * @returns {Promise<void>}
   */
  private async filterTrendingPage(filterValue: Category): Promise<void> {
    const responseTrending = await this.model.getListByField({
      field: MOVIE_FIELD_PAYLOAD.category,
      value: filterValue,
      like: false,
      limit: TOP_TRENDING_LIMIT,
    });

    if (responseTrending.code) {
      showAlertMessage(responseTrending.code);
      return;
    }

    this.movieList.trending = responseTrending.data;
  }

  /**
   * Handles get data of the page is displayed
   * @param {Path} path - The page is displayed.
   * @param {Category} filterValue - The category for filter.
   * @returns {Promise<void>}
   */
  private async getMovieData(path: Path, filterValue?: Category): Promise<void> {
    const MovieData = {
      homePage: filterValue
        ? () => this.filterHomePage(filterValue)
        : () => this.initHomePage(),
      favoritesPage: filterValue
        ? () => this.filterFavoritesPage(filterValue)
        : () => this.initFavoritesPage(),
      trendingPage: filterValue
        ? () => this.filterTrendingPage(filterValue)
        : () => this.initTrendingPage(),
    };

    let page: string = '';
    Object.entries(ROUTES).find(([key, value]) => {
      if (value === path) {
        page = key;
      }
    });

    await MovieData[page as MoviePage]();
  }

  /**
   * Handles create data of the page is displayed
   * @param {Path} path - The page is displayed.
   * @returns {Promise<FilteredMovieList>}
   */
  private async initData(path: Path): Promise<FilteredMovieList> {
    await this.getMovieData(path);

    const movieList = {
      trending: this.movieList.trending,
      favorites: this.movieList.favorites,
      continueWatching: this.movieList.continueWatching,
    };

    return new Promise(function (resolve, reject) {
      resolve(movieList);
      reject(ERROR_MESSAGES.serverError);
    });
  }

  /**
   * Handles the filter of movie data
   * @param {Category} filterValue - category was clicked.
   * @returns {Promise<void>}
   */
  private async filterMovieList(filterValue: Category): Promise<void> {
    await this.getMovieData(this.pathname, filterValue);

    this.displayMovieList(this.pathname);
  }

  /**
   * Handles render movie list in home page
   * @returns {void}
   */
  private displayHomePage(): void {
    renderMovieList(this.movieList.trending, TypeOfFilter.Trending);
    renderMovieList(this.movieList.continueWatching, TypeOfFilter.ContinueWatching);

    this.view.getMovieIdByMovieButton(this.updateFavorites);
    this.view.displayCreateMovieForm();
    this.view.displayUpdateMovieForm(this.displayMovieUpdate);
  }

  /**
   * Handles render movie list in favorites page
   * @returns {void}
   */
  private displayFavoritesPage(): void {
    renderMovieList(this.movieList.favorites, TypeOfFilter.Favorites);

    this.view.getMovieIdByMovieButton(this.removeMovieInFavorites);
  }

  /**
   * Handles render movie list in trending page
   * @returns {void}
   */
  private displayTrendingPage(): void {
    renderMovieList(this.movieList.trending, TypeOfFilter.Trending);

    this.view.getMovieIdByMovieButton(this.updateFavoritesTrending);
    this.view.getMovieIdByMovieCard(this.displayMovieDetail);
  }

  /**
   * Handles render data of the page is displayed
   * @param {Path} path - The page is displayed.
   * @returns {void}
   */
  private displayMovieList(path: Path): void {
    switch (path) {
      case ROUTES.homePage:
        this.displayHomePage();
        break;

      case ROUTES.favoritesPage:
        this.displayFavoritesPage();
        break;

      case ROUTES.trendingPage:
        this.displayTrendingPage();
        break;
    }

    this.view.removeLoading();
  }

  /**
   * Handles display movie list of the page
   * @returns {Promise<FilteredMovieList>}
   */
  private displayInitData(
    path: Path,
    handleInitData: (path: Path) => Promise<FilteredMovieList>,
  ): void {
    handleInitData(path).then(
      (movieList) => {
        this.movieList = movieList;

        this.displayMovieList(path);

        this.view.removeLoading();
      },
      (error) => {
        showAlertMessage(error);
      },
    );
  }

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @param {FilteredMovieList} typeOfFilter - The type of the movie.
   * @returns {Promise<boolean>} A promise status success or fail
   */
  private async updateFavorites(
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<boolean> {
    const movie = this.movieList[typeOfFilter].find((movie: IMovie) => movie.id === movieId);

    if (!movie) {
      showAlertMessage(ERROR_MESSAGES.update);
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
    const responseUpdatedMovie = await this.model.update(movieId, movie);

    if (responseUpdatedMovie.code) {
      showAlertMessage(responseUpdatedMovie.code);
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
  }

  /**
   * Handles the deletion of a movie in favorites page.
   * @param {number} movieId - The ID of the movie to be removed in favorites page.
   * @param {FilteredMovieList} typeOfFilter - The type of the movie.
   * @returns {Promise<void>}
   */
  private async removeMovieInFavorites(
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<void> {
    const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

    if (isSuccess) {
      this.movieList.favorites = this.movieList.favorites.filter((movie) => movie.id !== movieId);

      this.displayMovieList(this.pathname);
    }
  }

  /**
   * Handles the display movie detail
   * @param {number} movieId - The ID of the movie to be displayed detail in trending page.
   * @returns {Promise<void>}
   */
  private async displayMovieDetail(movieId: number): Promise<void> {
    // Call API get movie by id
    const responseMovie = await this.model.getById(movieId);

    if (responseMovie.code) {
      showAlertMessage(responseMovie.code);
      return;
    }

    this.renderDetail(responseMovie.data);
  }

  /**
   * Handles render data of the movie is displayed
   * @param {Movie} movie - The movie is displayed.
   * @returns {void}
   */
  private renderDetail(movie: IMovie): void {
    renderMovieDetail(movie);

    this.view.getMovieIdByHeartButton(this.updateFavoriteDetail);
  }

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @returns {Promise<void>}
   */
  private async updateFavoritesTrending(
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ): Promise<void> {
    const hasDetail: boolean = this.view.getImageDetailElement();

    if (hasDetail) {
      const movie = this.movieList.trending.find((movie: IMovie) => movie.id === movieId);

      this.view.addLoadingMovieButton();
      const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

      if (isSuccess && movie) {
        this.renderDetail(movie);
        this.view.updateLoadingFavorites(movieId);
      }
    } else {
      await this.updateFavorites(movieId, typeOfFilter);
    }
  }

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   * @returns {Promise<void>}
   */
  private async updateFavoriteDetail(movieId: number): Promise<void> {
    const typeOfFilter: keyof FilteredMovieList = TypeOfFilter.Trending;
    const movie = this.movieList[typeOfFilter].find((movie: IMovie) => movie.id === movieId);

    this.view.addLoadingHeartButton();

    const isSuccess = await this.updateFavorites(movieId, typeOfFilter);

    if (isSuccess && movie) {
      this.renderDetail(movie);
    }

    this.view.updateLoadingFavorites(movieId);
  }

  /**
   * Handles the display movie in form
   * @param {number} movieId - The ID of the movie to be displayed detail in form.
   * @returns {Promise<void>}
   */
  private async displayMovieUpdate(movieId: number): Promise<void> {
    // Call API get movie by id
    const movieIndex = this.movieList.trending.findIndex((movie: IMovie) => movie.id === movieId);
    const movie = this.movieList.trending[movieIndex];

    this.view.displayFormMovie(movie);
  }

  /**
   * Handles the display movie in form
   * @param {number} movieId - The ID of the movie to be displayed detail in form.
   * @param {IMovieOptionalField} movie - The data of the movie in form.
   * @returns {Promise<void>}
   */
  private async updateMovie(movieId: number, movie: IMovieOptionalField): Promise<void> {
    const responseUpdatedMovie = await this.model.update(movieId, movie);

    if (responseUpdatedMovie.code) {
      showAlertMessage(responseUpdatedMovie.code);
      return;
    }

    if (responseUpdatedMovie.data.isTrending) {
      const movieIndex = this.movieList.trending.findIndex(
        (movie: IMovie) => movie.id === responseUpdatedMovie.data.id,
      );

      this.movieList.trending[movieIndex] = responseUpdatedMovie.data;
    } else {
      this.movieList.trending = this.movieList.trending.filter(
        (item) => item.id !== responseUpdatedMovie.data.id,
      );
    }

    const movieIndex = this.movieList.continueWatching.findIndex(
      (movie: IMovie) => movie.id === responseUpdatedMovie.data.id,
    );
    const hasContinueWatching = movieIndex >= 0;

    if (hasContinueWatching)
      this.movieList.continueWatching[movieIndex] = responseUpdatedMovie.data;
  }

  /**
   * Handles the display movie in form
   * @param {IMovieOptionalField} movie - The data of the movie in form.
   * @returns {Promise<void>}
   */
  private async createMovie(movie: IMovieOptionalField): Promise<void> {
    const responseCreatedMovie = await this.model.create(movie);

    if (responseCreatedMovie.code) {
      showAlertMessage(responseCreatedMovie.code);
      return;
    }

    if (responseCreatedMovie.data.isTrending) {
      if (this.movieList.trending.length > TOP_TRENDING_LIMIT) {
        this.movieList.trending.pop();
      }

      this.movieList.trending.push(responseCreatedMovie.data);
    }
  }

  /**
   * Handles submit form movie
   * @param {IMovieOptionalField} movie - data from form.
   * @returns {Promise<void>}
   */
  private async submitMovieForm(movie: IMovieOptionalField): Promise<void> {
    if (movie.id) {
      await this.updateMovie(movie.id, movie);
    } else {
      await this.createMovie(movie);
    }

    this.displayMovieList(this.pathname);
    this.view.closeForm();
  }
}

export default Movie;
