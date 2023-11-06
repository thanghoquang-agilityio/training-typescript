import { MovieModel } from '@/models';
import { MovieView } from '@/views';
import { renderSidebar, renderNavbar } from '@/templates';

export class MovieController {
  model: MovieModel;
  view: MovieView;

  constructor(model: MovieModel, view: MovieView) {
    this.model = model;
    this.view = view;
    renderSidebar(window.location.pathname);
    renderNavbar();
  }
}
