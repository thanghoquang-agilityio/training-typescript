export const MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidFile: (field: string) => `${field} must be a image file`,
  invalidNumber: (field: string, min: number, max: number) =>
    `${field} must be between from ${min} to ${max}`,
};

export const ERROR_MESSAGES = {
  create: 'Movie creation failed',
  update: 'Movie update failed',
  renderMovieDetails: 'Displaying movie details failed',
  renderMovieList: 'Displaying movie list failed',
  renderNavbar: 'Displaying navbar failed',
  renderSidebar: 'Displaying sidebar failed',
  serverError: 'Internal server error',
};
