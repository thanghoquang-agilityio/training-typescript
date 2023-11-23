import { Movie } from '@/interfaces';
import { USER_ID } from '@/constants';

/**
 * Generates the details movie HTML template.
 * @param {Movie} movie - The data of movie.
 * @returns {string} - The generated HTML template for the details movie.
 */
const movieDetailTemplate = (movie: Movie): string => `
    <img
      class="card-details-cover-image"
      src="${movie.image}"
      alt="image-${movie.title}"
    />
    <div class="card-details-information">
      <div class="card-details-title-rating">
        <h3 class="card-details-title">${movie.title}</h3>
        ${
          movie.rating
            ? `<div class="card-details-rating">
                <img
                  class="icon-card-details-rating"
                  src="./icons/star.svg"
                  alt="star-icon"
                />
                <p class="text-card">${movie.rating}/10</p>
              </div>`
            : ''
        }
      </div>
      <span class="text-card">${movie.release}</span>
      <span class="text-card">${movie.type}</span>
      <span class="text-card">${movie.duration}</span>
      <p class="text">${movie.description}</p>
      <div class="card-details-actions">
        <button class="button-watch-movie">Watch now</button>
        <button class="button-heart-movie" id=${movie.id} data-favourites=${movie.favourites}>
          <img src=${
            movie.favourites.includes(USER_ID) ? './icons/heart-full.svg' : './icons/heart.svg'
          } alt="heart-icon" />
        </button>
      </div>
    </div>
  `;

export const renderMovieDetail = (movie: Movie) => {
  const movieDetailElement: HTMLElement | null = document.querySelector('.card-details');

  if (movieDetailElement) {
    movieDetailElement.innerHTML = movieDetailTemplate(movie);
  }
};
