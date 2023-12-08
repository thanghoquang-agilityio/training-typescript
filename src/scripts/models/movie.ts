import { AxiosError } from 'axios';

import { validateMovieResponse } from '@/utils';

import { API_RESOURCE } from '@/constants';

import { Category, ResponseMovie, ResponseMovieList } from '@/types';
import { IMovie, IMovieOptionalField } from '@/interfaces';

import axiosInstance from '@/services/axiosInstance';

class Movie {
  /**
   * Fetches movie details by movie ID from the API.
   * @param {number} id - The ID of the movie to fetch.
   * @returns {Promise<ResponseMovie>} A promise resolving to the movie details response.
   */
  getById(id: number): Promise<ResponseMovie> {
    return axiosInstance
      .get(`${API_RESOURCE.MOVIES}/${id}`)
      .then(({ data }) => {
        const responseSuccess: ResponseMovie = {
          data: validateMovieResponse(data),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovie = {
          code: error.code,
          data: {} as IMovie,
        };

        return responseError;
      });
  }

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {number} limit - Optional query parameters.
   * @returns {Promise<ResponseMovieList>} A promise resolving to the list of movies.
   */
  getList(limit: number = 0): Promise<ResponseMovieList> {
    return axiosInstance
      .get(`${API_RESOURCE.MOVIES}?${limit ? `_limit=${limit}` : ''}`)
      .then(({ data }) => {
        const responseSuccess: ResponseMovieList = {
          data: data.map((item: IMovie) => validateMovieResponse(item)),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovieList = {
          code: error.code,
          data: [],
        };

        return responseError;
      });
  }

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {keyof IMovie} .field - The field of movie.
   * @param {string | boolean | number} .value - The data select.
   * @param {boolean} .like - Optional query parameters.
   * @param {number} .limit - Optional query parameters.
   * @returns {Promise<ResponseMovieList>} A promise resolving to the list of movies.
   */
  getListByField({
    field,
    value = '',
    like = false,
    limit = 0,
  }: {
    field: keyof IMovie;
    value: string | boolean | number;
    like?: boolean;
    limit?: number;
  }): Promise<ResponseMovieList> {
    return axiosInstance
      .get(
        `${API_RESOURCE.MOVIES}?${limit ? `_limit=${limit}&${field}` : field}${
          like ? '_like' : ''
        }=${value}`,
      )
      .then(({ data }) => {
        const responseSuccess: ResponseMovieList = {
          data: data.map((item: IMovie) => validateMovieResponse(item)),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovieList = {
          code: error.code,
          data: [],
        };

        return responseError;
      });
  }

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {Category} .category - The category select.
   * @param {number} .favorites - Optional query parameters.
   * @param {number} .incompleteness - Optional query parameters.
   * @returns {Promise<ResponseMovieList>} A promise resolving to the list of movies.
   */
  filter({
    category,
    favorites,
    incompleteness,
  }: {
    category: Category;
    favorites?: number;
    incompleteness?: number;
  }): Promise<ResponseMovieList> {
    return axiosInstance
      .get(API_RESOURCE.MOVIES, {
        params: {
          category: category,
          favorites_like: favorites,
          incompleteness_like: incompleteness,
        },
      })
      .then(({ data }) => {
        const responseSuccess: ResponseMovieList = {
          data: data.map((item: IMovie) => validateMovieResponse(item)),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovieList = {
          code: error.code,
          data: [],
        };

        return responseError;
      });
  }

  /**
   * Creates a new movie by sending a POST request to the API.
   * @param {IMovieOptionalField} movie - The movie details to be created.
   * @returns {Promise<ResponseMovie>} A promise resolving to the created movie details.
   */
  create(movie: IMovieOptionalField): Promise<ResponseMovie> {
    return axiosInstance
      .post(API_RESOURCE.MOVIES, movie)
      .then(({ data }) => {
        const responseSuccess: ResponseMovie = {
          data: validateMovieResponse(data),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovie = {
          code: error.code,
          data: {} as IMovie,
        };

        return responseError;
      });
  }

  /**
   * Updates an existing movie by sending a PATCH request to the API.
   * @param {number} id - The ID of the movie to update.
   * @param {IMovieOptionalField} movie - The movie details to update.
   * @returns {Promise<ResponseMovie>} A promise resolving to the updated movie details.
   */
  update(id: number, movie: IMovieOptionalField): Promise<ResponseMovie> {
    return axiosInstance
      .patch(`${API_RESOURCE.MOVIES}/${id}`, movie)
      .then(({ data }) => {
        const responseSuccess: ResponseMovie = {
          data: validateMovieResponse(data),
        };

        return responseSuccess;
      })
      .catch((error: AxiosError) => {
        const responseError: ResponseMovie = {
          code: error.code,
          data: {} as IMovie,
        };

        return responseError;
      });
  }
}

export default Movie;
