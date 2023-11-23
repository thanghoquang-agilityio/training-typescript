import axios from '@/utils/axios';

import { Movie } from '@/interfaces';
import { Category } from '@/types';
import { API_ENDPOINT } from '@/constants';

export class MovieModel {
  /**
   * Fetches movie details by movie ID from the API.
   * @param {number} id - The ID of the movie to fetch.
   * @returns {Promise<Movie>} A promise resolving to the movie details response.
   */
  getMovieById = async (id: number): Promise<{ status: number; data: Movie }> => {
    const response = await axios.get(`${API_ENDPOINT.MOVIES}/${id}`);

    return { status: response.status, data: response.data };
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {number} limit - Optional query parameters.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  getMovieList = async (limit: number = 0): Promise<{ status: number; data: Movie[] }> => {
    const response = await axios.get(`${API_ENDPOINT.MOVIES}?${limit ? `_limit=${limit}` : ''}`);

    return { status: response.status, data: response.data };
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
  }): Promise<{ status: number; data: Movie[] }> => {
    const response = await axios.get(
      `${API_ENDPOINT.MOVIES}?${limit ? `_limit=${limit}&${field}` : field}${
        like ? '_like' : ''
      }=${value}`,
    );

    return { status: response.status, data: response.data };
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  filterMovies = async ({
    category,
    favourites,
    incompleteness,
  }: {
    category: Category;
    favourites?: number;
    incompleteness?: number;
  }): Promise<{ status: number; data: Movie[] }> => {
    const response = await axios.get(API_ENDPOINT.MOVIES, {
      params: {
        category: category,
        favourites_like: favourites,
        incompleteness_like: incompleteness,
      },
    });

    return { status: response.status, data: response.data };
  };

  /**
   * Deletes a movie by its ID.
   * @param {number} id - The ID of the movie to delete.
   * @returns {Promise<{ status: number; data: Movie }>} A promise that resolves when the movie is deleted.
   */
  deleteMovie = async (id: number): Promise<{ status: number; data: Movie }> => {
    const response = await axios.delete(`${API_ENDPOINT.MOVIES}/${id}`);

    return { status: response.status, data: response.data };
  };

  /**
   * Creates a new movie by sending a POST request to the API.
   * @param {Movie} movie - The movie details to be created.
   * @returns {Promise<{ status: number; data: Movie }>} A promise resolving to the created movie details.
   */
  createMovie = async (movie: Movie): Promise<{ status: number; data: Movie }> => {
    const response = await axios.post(API_ENDPOINT.MOVIES, movie);

    return { status: response.status, data: response.data };
  };

  /**
   * Updates an existing movie by sending a PATCH request to the API.
   * @param {number} id - The ID of the movie to update.
   * @param {Movie} movie - The movie details to update.
   * @returns {Promise<{ status: number; data: Movie }>} A promise resolving to the updated movie details.
   */
  updateMovie = async (id: number, movie: Movie): Promise<{ status: number; data: Movie }> => {
    const response = await axios.patch(`${API_ENDPOINT.MOVIES}/${id}`, movie);

    return { status: response.status, data: response.data };
  };
}
