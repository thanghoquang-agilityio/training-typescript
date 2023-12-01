import { AxiosError } from 'axios';

import { showAlertMessage, validateMovieResponse } from '@/utils';

import { API_RESOURCE } from '@/constants';

import { Category } from '@/types';
import { IMovie, IMovieOptionalField } from '@/interfaces';

import axiosInstance from '@/services/axiosInstance';

class Movie {
  /**
   * Fetches movie details by movie ID from the API.
   * @param {number} id - The ID of the movie to fetch.
   * @returns {Promise<IMovie>} A promise resolving to the movie details response.
   */
  getById = async (id: number): Promise<IMovie> =>
    await axiosInstance
      .get(`${API_RESOURCE.MOVIES}/${id}`)
      .then(({ data }) => validateMovieResponse(data))
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);

        return {} as IMovie;
      });

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {number} limit - Optional query parameters.
   * @returns {Promise<IMovie[]>} A promise resolving to the list of movies.
   */
  getList = async (limit: number = 0): Promise<IMovie[]> =>
    await axiosInstance
      .get(`${API_RESOURCE.MOVIES}?${limit ? `_limit=${limit}` : ''}`)
      .then(({ data }) => data.map((item: IMovie) => validateMovieResponse(item)) as IMovie[])
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);
        
        return [];
      });

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @returns {Promise<IMovie[]>} A promise resolving to the list of movies.
   */
  getListByField = async ({
    field,
    value = '',
    like = false,
    limit = 0,
  }: {
    field: keyof IMovie;
    value: string | boolean | number;
    like?: boolean;
    limit?: number;
  }): Promise<IMovie[]> =>
    await axiosInstance
      .get(
        `${API_RESOURCE.MOVIES}?${limit ? `_limit=${limit}&${field}` : field}${
          like ? '_like' : ''
        }=${value}`,
      )
      .then(({ data }) => data.map((item: IMovie) => validateMovieResponse(item)) as IMovie[])
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);

        return [];
      });

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @returns {Promise<IMovie[]>} A promise resolving to the list of movies.
   */
  filter = async ({
    category,
    favorites,
    incompleteness,
  }: {
    category: Category;
    favorites?: number;
    incompleteness?: number;
  }): Promise<IMovie[]> =>
    await axiosInstance
      .get(API_RESOURCE.MOVIES, {
        params: {
          category: category,
          favorites_like: favorites,
          incompleteness_like: incompleteness,
        },
      })
      .then(({ data }) => data.map((item: IMovie) => validateMovieResponse(item)) as IMovie[])
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);

        return [];
      });

  /**
   * Creates a new movie by sending a POST request to the API.
   * @param {IMovieOptionalField} movie - The movie details to be created.
   * @returns {Promise<IMovie>} A promise resolving to the created movie details.
   */
  create = async (movie: IMovieOptionalField): Promise<IMovie> =>
    await axiosInstance
      .post(API_RESOURCE.MOVIES, movie)
      .then(({ data }) => validateMovieResponse(data))
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);

        return {} as IMovie;
      });

  /**
   * Updates an existing movie by sending a PATCH request to the API.
   * @param {number} id - The ID of the movie to update.
   * @param {IMovieOptionalField} movie - The movie details to update.
   * @returns {Promise<IMovie>} A promise resolving to the updated movie details.
   */
  update = async (id: number, movie: IMovieOptionalField): Promise<IMovie> =>
    await axiosInstance
      .patch(`${API_RESOURCE.MOVIES}/${id}`, movie)
      .then(({ data }) => validateMovieResponse(data))
      .catch((error: AxiosError) => {
        if (error.code) showAlertMessage(error.code);
        
        return {} as IMovie;
      });
}

export default Movie;
