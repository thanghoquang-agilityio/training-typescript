import { Movie } from '@/interfaces';
import { TypeOfFilter } from '@/enums';
import { ERROR_MESSAGES, USER_ID } from '@/constants';

/**
 * Generates the movie list HTML template.
 * @param {Movie[]} movieList - The data of movie list.
 * @param {TypeOfFilter} typeOfFilter - The display type movie of movie list.
 * @returns {string} - The generated HTML template for the movie list.
 */
const movieListTemplate = (movieList: Movie[], typeOfFilter: TypeOfFilter): string =>
  movieList
    .map(
      (movie) =>
        `
          <figure class="card-${typeOfFilter}" id="${movie?.id}">
            <button class="button-heart-card">
              <img
                class="icon-button-card"
                src=${
                  movie?.favorites.includes(USER_ID)
                    ? './icons/heart-full.svg'
                    : './icons/heart.svg'
                }
                alt="heart-icon"
              />
            </button>
            <div class="card-img">
              <img src="${movie?.image}" alt="image-${movie?.title}">
              ${
                typeOfFilter !== TypeOfFilter.ContinueWatching
                  ? `
                    <figcaption class="card-content">
                        <p class="text">${movie?.title}</p>
                        <p class="text-sub-title">${movie?.release} | ${movie?.type}</p>
                    </figcaption>
                  `
                  : ''
              }
            </div>
            <span class="loader"></span>
          </figure>
        `,
    )
    .join('');

export const renderMovieList = (movieList: Movie[], typeOfFilter: TypeOfFilter) => {
  let movieListElement: HTMLElement | null = null;

  switch (typeOfFilter) {
    case TypeOfFilter.Trending:
      movieListElement = document.querySelector('.trending-movie-wrapper');
      break;

    case TypeOfFilter.Favorites:
      movieListElement = document.querySelector('.favorites-wrapper');
      break;

    case TypeOfFilter.ContinueWatching:
    default: {
      movieListElement = document.querySelector('.continue-watching-wrapper');
      break;
    }
  }

  if (movieListElement) {
    const parentSectionElement = movieListElement?.closest('section');
    const textEmptyElement: HTMLElement | null = document.querySelector('.text-empty');

    if (parentSectionElement) {
      if (movieList.length) {
        parentSectionElement.style.display = '';
        movieListElement.innerHTML = movieListTemplate(movieList, typeOfFilter);
      } else {
        parentSectionElement.style.display = 'none';
      }
    } else {
      window.alert(ERROR_MESSAGES.renderMovieList);
    }

    if (textEmptyElement) {
      if (movieList.length) {
        textEmptyElement.style.display = 'none';
      } else {
        textEmptyElement.style.display = 'block';
      }
    }
  }
};
