import { showAlertMessage, stringHelper } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { TypeOfFilter } from '@/enums';
import { IMovie } from '@/interfaces';
import { ElementMovie, FilteredMovieList } from '@/types';
import { movieListTemplate } from '@/templates';

/**
 * Get element movie by class
 * @param {string} list - class of element contains list movie.
 * @param {string} container - class section cover movie list
 * @returns {ElementMovie}
 */
const getElementMovie = (list: string, container: string): ElementMovie => {
  const elementMovie: ElementMovie = {
    elementList: document.querySelector(list) as HTMLElement,
    elementContainer: document.querySelector(container) as HTMLElement,
  };

  return elementMovie;
};

/**
 * Set element movie list by type of filter
 * @param {TypeOfFilter} typeOfFilter - class of element contains list movie.
 * @returns {ElementMovie}
 */
const setMovieList = (typeOfFilter: TypeOfFilter): ElementMovie => {
  const type = stringHelper.convertSnakeToCamel(typeOfFilter) as keyof FilteredMovieList;

  const MovieList = {
    trending: getElementMovie('.trending-movie-wrapper', '.trending-movie'),
    favorites: getElementMovie('.favorites-wrapper', '.favorites'),
    continueWatching: getElementMovie('.continue-watching-wrapper', '.continue-watching'),
  };

  return MovieList[type];
};

/**
 * Render list movie in element movie
 * @param {IMovie[]} movieList - list movie for render.
 * @param {TypeOfFilter} typeOfFilter - class of element contains list movie.
 * @returns {void}
 */
const renderMovieList = (movieList: IMovie[], typeOfFilter: TypeOfFilter): void => {
  const textEmptyElement = document.querySelector('.text-empty') as HTMLElement;
  const elementMovie = setMovieList(typeOfFilter);
  const movieListElement = elementMovie.elementList;
  const parentSectionElement = elementMovie.elementContainer;

  if (!movieListElement || !parentSectionElement) {
    showAlertMessage(ERROR_MESSAGES.renderMovieList);
    return;
  }

  if (movieList.length) {
    parentSectionElement.style.display = '';
    movieListElement.innerHTML = movieListTemplate(movieList, typeOfFilter);
    textEmptyElement.style.display = 'none';
  } else {
    parentSectionElement.style.display = 'none';
    textEmptyElement.style.display = 'block';
  }
};

export default renderMovieList;
