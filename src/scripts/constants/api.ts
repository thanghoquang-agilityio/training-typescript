export const API_ENDPOINT = {
  MOVIES: '/movies',
};

export const MOVIE_FIELD_PAYLOAD = {
  id: 'id',
  title: 'title',
  category: 'category',
  type: 'type',
  release: 'release',
  isTrending: 'isTrending',
  favorites: 'favorites',
  incompleteness: 'incompleteness',
} as const;
