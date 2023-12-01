import { showAlertMessage } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { TypeOfFilter } from '@/enums';
import { IMovie } from '@/interfaces';
import { movieListTemplate } from '@/templates';

const renderMovieList = (movieList: IMovie[], typeOfFilter: TypeOfFilter) => {
  let movieListElement: HTMLElement;
  let parentSectionElement: HTMLElement;
  const textEmptyElement = document.querySelector('.text-empty') as HTMLElement;

  switch (typeOfFilter) {
    case TypeOfFilter.Trending: {
      movieListElement = document.querySelector('.trending-movie-wrapper') as HTMLElement;
      parentSectionElement =
        (document.querySelector('.trending-movie') as HTMLElement) ||
        (document.querySelector('.trending-now') as HTMLElement);

      break;
    }

    case TypeOfFilter.Favorites: {
      movieListElement = document.querySelector('.favorites-wrapper') as HTMLElement;
      parentSectionElement = document.querySelector('.favorites') as HTMLElement;

      break;
    }

    case TypeOfFilter.ContinueWatching: {
      movieListElement = document.querySelector('.continue-watching-wrapper') as HTMLElement;
      parentSectionElement = document.querySelector('.continue-watching') as HTMLElement;
      break;
    }
  }

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
