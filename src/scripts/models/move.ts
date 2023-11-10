import axios from '@/utils/axios';

import { FiledMovie } from '@/types';
import { Movie } from '@/interfaces';
import { API_ENDPOINT } from '@/constants';

export class MovieModel {
  /**
   * Fetches movie details by movie ID from the API.
   * @param {string} id - The ID of the movie to fetch.
   * @returns {Promise<Movie>} A promise resolving to the movie details response.
   */
  getMovieById = async (id: string): Promise<Movie> => {
    const data: Movie = await axios.get(`${API_ENDPOINT.MOVIES}/${id}`);

    return data;
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {string} params - Optional query parameters.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  getMovieList = async (limit: number = 0): Promise<Movie[]> => {
    const response: Movie[] = await axios.get(
      `${API_ENDPOINT.MOVIES}?${limit ? '_limit=' + limit : ''}`,
    );

    return response;
  };

  /**
   * Fetches the list of movies with expanded movie manager information.
   * @param {string} params - Optional query parameters.
   * @returns {Promise<Movie[]>} A promise resolving to the list of movies.
   */
  getMoviesByField = async (
    filed: FiledMovie,
    params: string = '',
    like: boolean = false,
    limit: number = 0,
  ): Promise<Movie[]> => {
    const response: Movie[] = await axios.get(
      `${API_ENDPOINT.MOVIES}?${limit ? '_limit=' + limit : ''}${limit ? '&' + filed : filed}${
        like ? '_like' : ''
      }=${params}`,
    );

    return response;
  };

  /**
   * Deletes a movie by its ID.
   * @param {string} id - The ID of the movie to delete.
   * @returns {Promise<void>} A promise that resolves when the movie is deleted.
   */
  deleteMovie = async (id: string): Promise<Movie> => {
    const data: Movie = await axios.delete(`${API_ENDPOINT.MOVIES}/${id}`);

    return data;
  };

  /**
   * Creates a new movie by sending a POST request to the API.
   * @param {MovieForm} movie - The movie details to be created.
   * @returns {Promise<MovieForm>} A promise resolving to the created movie details.
   */
  createMovie = async (movie: Movie): Promise<Movie> => {
    const data: Movie = await axios.post(API_ENDPOINT.MOVIES, movie);

    return data;
  };

  /**
   * Updates an existing movie by sending a PATCH request to the API.
   * @param {string} id - The ID of the movie to update.
   * @param {MovieForm} movie - The movie details to update.
   * @returns {Promise<MovieForm>} A promise resolving to the updated movie details.
   */
  updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
    const data: Movie = await axios.patch(`${API_ENDPOINT.MOVIES}/${id}`, movie);

    return data;
  };
}
