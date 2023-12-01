const API_RESOURCE = {
  MOVIES: '/movies',
};

const MOVIE_FIELD_PAYLOAD = {
  id: 'id',
  title: 'title',
  category: 'category',
  type: 'type',
  release: 'release',
  isTrending: 'isTrending',
  favorites: 'favorites',
  incompleteness: 'incompleteness',
} as const;

// Service time out 5 minutes
const SERVICE_TIMEOUT = 5 * 60 * 1000;

export { API_RESOURCE, MOVIE_FIELD_PAYLOAD, SERVICE_TIMEOUT };
