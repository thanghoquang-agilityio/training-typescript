import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/templates';
import { Movie, FilteredMovieList } from '@/interfaces';
import { TypeOfFilter, HttpStatusCodes } from '@/enums';
import { Category } from '@/types';
import { ROUTES, USER_ID, MOVIE_FIELD_PAYLOAD, TOP_TRENDING_LIMIT } from '@/constants';

export class MovieController {
  model: MovieModel;
  view: MovieView;
  movieList: FilteredMovieList;
  pathname: string;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;
    this.movieList = {
      trending: [],
      favorites: [],
      continueWatching: [],
    };

    this.pathname = window.location.pathname;
    this.initData(this.pathname);

    renderSidebar(this.pathname);
    renderNavbar();

    this.view.filterMovie(this.filterMovieList);
    this.view.getDataInMovieForm(this.submitMovieForm);
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
          field: MOVIE_FIELD_PAYLOAD.incompleteness,
          value: USER_ID,
          like: true,
        });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.continueWatching = response.data;
        }

        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD_PAYLOAD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.trending = response.data;
        }

        break;

      case ROUTES.favoritesPage:
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD_PAYLOAD.favorites,
          value: USER_ID,
          like: true,
        });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.favorites = response.data;
        }
        
        break;

      case ROUTES.trendingPage:
      default: {
        response = await this.model.getMoviesByField({
          field: MOVIE_FIELD_PAYLOAD.isTrending,
          value: true,
          like: false,
          limit: TOP_TRENDING_LIMIT,
        });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.trending = response.data;
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
        renderMovieList(this.movieList.trending, TypeOfFilter.Trending);
        renderMovieList(this.movieList.continueWatching, TypeOfFilter.ContinueWatching);

        this.view.getMovieIdByMovieButton(this.updateFavorites);
        this.view.displayCreateMovieForm();
        this.view.displayUpdateMovieForm(this.displayMovieUpdate);
        break;

      case ROUTES.favoritesPage:
        renderMovieList(this.movieList.favorites, TypeOfFilter.Favorites);

        this.view.getMovieIdByMovieButton(this.removeMovieInFavorites);
        break;

      case ROUTES.trendingPage:
      default: {
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
   */
  private updateFavorites = async (movieId: number, typeOfFilter: keyof FilteredMovieList) => {
    const movie: Movie | undefined = this.movieList[typeOfFilter].find(
      (movie: Movie) => movie.id === movieId,
    );
    let favorites: number[] = [];

    if (movie) {
      favorites = movie.favorites;
    }

    // Check like or dislike movie
    if (favorites.includes(USER_ID)) {
      favorites = favorites.filter((item) => USER_ID !== item);
    } else {
      if (!favorites.length) {
        favorites = [USER_ID];
      } else {
        favorites.push(USER_ID);
      }
    }

    if (movie) {
      movie.favorites = favorites;

      // Call API update favorites
      const response = await this.model.updateMovie(movieId, movie);

      // Check update success or failed for update movie data
      if (response.status === HttpStatusCodes.OK && typeOfFilter !== TypeOfFilter.Favorites) {
        this.movieList[typeOfFilter].forEach((movie: Movie) => {
          if (movie.id === movieId) {
            movie.favorites = favorites;
          }
        });

        this.displayMovieList(this.pathname);
      }
    }
  };

  /**
   * Handles the deletion of a movie in favorites page.
   * @param {number} movieId - The ID of the movie to be removed in favorites page.
   * @param {FilteredMovieList} typeOfFilter - The type of the movie.
   */
  private removeMovieInFavorites = async (
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ) => {
    await this.updateFavorites(movieId, typeOfFilter);

    this.movieList.favorites = this.movieList.favorites.filter((movie) => movie.id !== movieId);

    this.displayMovieList(this.pathname);
  };

  /**
   * Handles the display movie detail
   * @param {number} movieId - The ID of the movie to be displayed detail in trending page.
   */
  private displayMovieDetail = async (movieId: number) => {
    // Call API get movie by id
    const response = await this.model.getMovieById(movieId);

    if (response.status === HttpStatusCodes.OK && response.data) {
      this.renderDetail(response.data);
    }
  };

  /**
   * Handles render data of the movie is displayed
   * @param {Movie} movie - The movie is displayed.
   */
  private renderDetail = (movie: Movie) => {
    renderMovieDetail(movie);

    this.view.getMovieIdByHeartButton(this.updateFavoriteDetail);
  };

  /**
   * Handles the change of favorites movie
   * @param {number} movieId - The ID of the movie to be updated in favorites page.
   */
  private updateFavoritesTrending = async (
    movieId: number,
    typeOfFilter: keyof FilteredMovieList,
  ) => {
    const hasDetail: boolean = this.view.getImageDetailElement();

    if (hasDetail) {
      const movie = this.movieList.trending.find((movie: Movie) => movie.id === movieId);

      this.view.addLoadingMovieButton();
      await this.updateFavorites(movieId, typeOfFilter);

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
   */
  private updateFavoriteDetail = async (movieId: number) => {
    const typeOfFilter: keyof FilteredMovieList = TypeOfFilter.Trending;
    const movie: Movie | undefined = this.movieList[typeOfFilter].find(
      (movie: Movie) => movie.id === movieId,
    );

    this.view.addLoadingHeartButton();

    await this.updateFavorites(movieId, typeOfFilter);

    if (movie) {
      this.renderDetail(movie);
    }

    this.view.updateLoadingFavorites(movieId);
  };

  /**
   * Handles the filter of movie data
   * @param {string} filterValue - category was clicked.
   * For example, the movie filter has a category of Series,...
   */
  private filterMovieList = async (filterValue: string) => {
    let response;

    const category: Category = filterValue as Category;

    switch (this.pathname) {
      case ROUTES.homePage:
        response = await this.model.filterMovies({ category: category, incompleteness: USER_ID });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.continueWatching = response.data;
        }

        if (filterValue) {
          response = await this.model.getMoviesByField({
            field: MOVIE_FIELD_PAYLOAD.category,
            value: filterValue,
            like: false,
            limit: TOP_TRENDING_LIMIT,
          });

          if (response.status === HttpStatusCodes.OK && response.data) {
            this.movieList.trending = response.data;
          }
        }

        break;

      case ROUTES.favoritesPage:
        response = await this.model.filterMovies({ category: category, favorites: USER_ID });

        if (response.status === HttpStatusCodes.OK && response.data) {
          this.movieList.favorites = response.data;
        }

        break;

      case ROUTES.trendingPage:
      default:
        if (filterValue) {
          response = await this.model.getMoviesByField({
            field: MOVIE_FIELD_PAYLOAD.category,
            value: filterValue,
            like: false,
            limit: TOP_TRENDING_LIMIT,
          });

          if (response.status === HttpStatusCodes.OK && response.data) {
            this.movieList.trending = response.data;
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
    const movieIndex = this.movieList.trending.findIndex((movie: Movie) => movie.id === movieId);
    const movie = this.movieList.trending[movieIndex];

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

      if (response.status === HttpStatusCodes.OK && response.data) {
        if (response.data.isTrending) {
          const movieIndex = this.movieList.trending.findIndex(
            (movie: Movie) => response.data && movie.id === response.data.id,
          );

          this.movieList.trending[movieIndex] = response.data;
        } else {
          this.movieList.trending = this.movieList.trending.filter(
            (item) => response.data && item.id !== response.data.id,
          );
        }

        this.displayMovieList(this.pathname);

        return true;
      }
    } else {
      const response = await this.model.createMovie(movie);

      if (response.status === HttpStatusCodes.Created && response.data) {
        if (response.data.isTrending) {
          if (this.movieList.trending.length > TOP_TRENDING_LIMIT) {
            this.movieList.trending.pop();
          }

          this.movieList.trending.push(response.data);
          this.displayMovieList(this.pathname);
        }

        return true;
      }
    }
  };
}
