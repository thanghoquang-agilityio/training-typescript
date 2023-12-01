import { stringHelper } from '@/utils';
import { DEFAULT_LOGGED_USER_ID } from '@/constants';
import { IMovie } from '@/interfaces';

/**
 * Generates the details movie HTML template.
 * @param {Movie} movie - The data of movie.
 * @returns {string} - The generated HTML template for the details movie.
 */
const movieDetailTemplate = (movie: IMovie): string => `
    <img
      class="card-details-cover-image"
      src="${movie?.image}"
      alt="image-${movie?.title}"
    />
    <div class="card-details-information">
      <div class="card-details-title-rating">
        <h3 class="card-details-title">${movie?.title}</h3>
        ${
          movie?.rating
            ? `<div class="card-details-rating">
                <img
                  class="icon-card-details-rating"
                  src="./icons/star.svg"
                  alt="star-icon"
                />
                <p class="text-card">${movie?.rating}/10</p>
              </div>`
            : ''
        }
      </div>
      <span class="text-card">${movie?.release}</span>
      <span class="text-card">${movie?.type}</span>
      <span class="text-card">${stringHelper.formatDuration(movie?.duration)}</span>
      <p class="text">${movie?.description}</p>
      <div class="card-details-actions">
        <button class="button-watch-movie text-button">Watch now</button>
        <button class="button-heart-movie" id=${movie?.id} data-favorites=${movie?.favorites}>
          <img src=${
            movie?.favorites.includes(DEFAULT_LOGGED_USER_ID)
              ? './icons/heart-full.svg'
              : './icons/heart.svg'
          } alt="heart-icon" />
        </button>
      </div>
    </div>
  `;

export default movieDetailTemplate;
