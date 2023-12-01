import { DEFAULT_LOGGED_USER_ID } from '@/constants';
import { TypeOfFilter } from '@/enums';

import { IMovie } from '@/interfaces';

/**
 * Generates the movie list HTML template.
 * @param {Movie[]} movieList - The data of movie list.
 * @param {TypeOfFilter} typeOfFilter - The display type movie of movie list.
 * @returns {string} - The generated HTML template for the movie list.
 */
const movieListTemplate = (movieList: IMovie[], typeOfFilter: TypeOfFilter): string =>
  movieList
    .map(
      (movie) =>
        `
          <figure class="card-${typeOfFilter}" id="${movie?.id}">
            <button class="button-heart-card">
              <img
                class="icon-button-card"
                src=${
                  movie?.favorites.includes(DEFAULT_LOGGED_USER_ID)
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

export default movieListTemplate;
