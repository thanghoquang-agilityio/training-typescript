import { Movie } from '@/interfaces';
import { MovieGenre } from '@/enums';

/**
 * Generates the movie list HTML template.
 * @param {Movie[]} movieList - The data of movie list.
 * @param {MovieGenre} movieGenre - The display type movie of movie list.
 * @returns {string} - The generated HTML template for the movie list.
 */
const movieListTemplate = (movieList: Movie[], movieGenre: MovieGenre): string => {
  const movieListHTML = movieList
    .map(
      ({ id, title, image, release, type }) =>
        `
          <figure class="card-${movieGenre}" id="movie-${id}">
            <button class="button-heart-card">
              <img
                class="icon-button-card"
                src="./icons/heart-full.svg"
                alt="heart-icon"
              />
            </button>
            <div class="card-img">
              <img src="${image}" alt="image-${title}">
              ${
                movieGenre !== MovieGenre.ContinueWatching
                  ? `
                    <figcaption class="card-content">
                        <p class="text">${title}</p>
                        <p class="text-sub-title">${release} | ${type}</p>
                    </figcaption>
                  `
                  : ''
              }
            </div>
          </figure>
        `,
    )
    .join('');

  return movieListHTML;
};

export const renderMovieList = (movieList: Movie[], movieGenre: MovieGenre) => {
  let movieListElement: HTMLElement | null = null;

  switch (movieGenre) {
    case MovieGenre.Trending:
      movieListElement = document.querySelector('.trending-movie-wrapper');
      break;

    case MovieGenre.Favourites:
      movieListElement = document.querySelector('.favourites-wrapper');
      break;

    case MovieGenre.ContinueWatching:
      movieListElement = document.querySelector('.continue-watching-wrapper');
      break;

    default: {
    }
  }

  if (movieListElement) {
    movieListElement.innerHTML = movieListTemplate(movieList, movieGenre);
  }
};
