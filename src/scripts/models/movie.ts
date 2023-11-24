import axios from '@/services/axios';
import { AxiosResponse, AxiosError } from 'axios';

import { Movie } from '@/interfaces';
import { Category } from '@/types';
import { API_ENDPOINT, ERROR_MESSAGES } from '@/constants';

export class MovieModel {
  /**
   * Fetches movie details by movie ID from the API.
   * @param {number} id - The ID of the movie to fetch.
   * @returns {Promise<Movie>} A promise resolving to the movie details response.
   */
  getMovieById = async (
    id: number,
  ): Promise<{ status: number | undefined; data: Movie | undefined }> => {
    try {
      const response: AxiosResponse<Movie> = await axios.get(`${API_ENDPOINT.MOVIES}/${id}`);

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {number} limit - Optional query parameters.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  getMovieList = async (
    limit: number = 0,
  ): Promise<{ status: number | undefined; data: Movie[] | undefined }> => {
    try {
      const response = await axios.get(`${API_ENDPOINT.MOVIES}?${limit ? `_limit=${limit}` : ''}`);

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  getMoviesByField = async ({
    field,
    value = '',
    like = false,
    limit = 0,
  }: {
    field: keyof Movie;
    value: string | boolean | number;
    like?: boolean;
    limit?: number;
  }): Promise<{ status: number | undefined; data: Movie[] | undefined }> => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT.MOVIES}?${limit ? `_limit=${limit}&${field}` : field}${
          like ? '_like' : ''
        }=${value}`,
      );

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  filterMovies = async ({
    category,
    favorites,
    incompleteness,
  }: {
    category: Category;
    favorites?: number;
    incompleteness?: number;
  }): Promise<{ status: number | undefined; data: Movie[] | undefined }> => {
    try {
      const response = await axios.get(API_ENDPOINT.MOVIES, {
        params: {
          category: category,
          favorites_like: favorites,
          incompleteness_like: incompleteness,
        },
      });

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };

  /**
   * Creates a new movie by sending a POST request to the API.
   * @param {Movie} movie - The movie details to be created.
   * @returns {Promise<{ status: number; data: Movie }>} A promise resolving to the created movie details.
   */
  createMovie = async (
    movie: Movie,
  ): Promise<{ status: number | undefined; data: Movie | undefined }> => {
    try {
      const response = await axios.post(API_ENDPOINT.MOVIES, movie);

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };

  /**
   * Updates an existing movie by sending a PATCH request to the API.
   * @param {number} id - The ID of the movie to update.
   * @param {Movie} movie - The movie details to update.
   * @returns {Promise<{ status: number; data: Movie }>} A promise resolving to the updated movie details.
   */
  updateMovie = async (
    id: number,
    movie: Movie,
  ): Promise<{ status: number | undefined; data: Movie | undefined }> => {
    try {
      const response = await axios.patch(`${API_ENDPOINT.MOVIES}/${id}`, movie);

      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return { status: axiosError.response?.status, data: undefined };
    }
  };
}
