import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar, renderMovieList, renderMovieDetail } from '@/templates';
import { MovieGenre } from '@/enums';
import { ROUTES } from '@/constants';

export class MovieController {
  model: MovieModel;
  view: MovieView;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;

    const pathname = window.location.pathname;

    renderSidebar(pathname);
    renderNavbar();

    this.displayMovieList(pathname);
  }

  private displayMovieList = async (path: string) => {
    const trendingMovieList = await this.model.getMovieList(4);

    switch (path) {
      case ROUTES.homePage:
        const continueWatchingMovieList = await this.model.getMoviesByField('incompleteness', '1');

        renderMovieList(trendingMovieList, MovieGenre.Trending);
        renderMovieList(continueWatchingMovieList, MovieGenre.ContinueWatching);
        break;

      case ROUTES.favouritesPage:
        const favouritesMovieList = await this.model.getMoviesByField('favourites', '1');

        renderMovieList(favouritesMovieList, MovieGenre.Favourites);
        break;

      case ROUTES.trendingPage:
      default: {
        const detailsMovie = await this.model.getMovieById('1');

        renderMovieList(trendingMovieList, MovieGenre.Trending);
        renderMovieDetail(detailsMovie);
        break;
      }
    }
  };
}
