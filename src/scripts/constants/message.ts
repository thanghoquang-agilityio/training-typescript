const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidFile: (field: string) => `${field} must be a image file`,
  invalidSizeOfFile: (field: string) => `${field} is too large in size`,
  invalidExtensionOfFile: (field: string) => `${field} is not in the correct file format`,
  invalidNumber: (field: string, min: number, max: number) =>
    `${field} must be between from ${min} to ${max}`,
};

const ERROR_MESSAGES = {
  create: 'Movie creation failed',
  update: 'Movie update failed',
  renderMovieDetails: 'Displaying movie details failed',
  renderMovieList: 'Displaying movie list failed',
  renderNavbar: 'Displaying navbar failed',
  renderSidebar: 'Displaying sidebar failed',
  serverError: 'Internal server error',
};

export { VALIDATION_MESSAGES, ERROR_MESSAGES };
