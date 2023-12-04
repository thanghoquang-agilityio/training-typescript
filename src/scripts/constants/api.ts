const API_RESOURCE = {
  MOVIES: '/movies',
};

// Define accepted fields in api payload
// It has as const because using type keyof MOVIE_FIELD_PAYLOAD for params
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

// Limit when call api
const TOP_TRENDING_LIMIT = 4;

export { API_RESOURCE, MOVIE_FIELD_PAYLOAD, SERVICE_TIMEOUT, TOP_TRENDING_LIMIT };
