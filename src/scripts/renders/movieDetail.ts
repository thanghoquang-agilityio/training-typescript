import { showAlertMessage } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { IMovie } from '@/interfaces';
import { movieDetailTemplate } from '@/templates';

const renderMovieDetail = (movie: IMovie) => {
  const movieDetailElement = document.querySelector('.card-details') as HTMLElement;

  if (!movieDetailElement) {
    showAlertMessage(ERROR_MESSAGES.renderMovieDetails);

    return;
  }

  movieDetailElement.innerHTML = movieDetailTemplate(movie);
};

export default renderMovieDetail;
