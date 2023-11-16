const USER_ID = '1';

const MOVIE_FIELD = {
  id: 'id',
  title: 'title',
  category: 'category',
  type: 'type',
  release: 'release',
  isTrending: 'isTrending',
  favourites: 'favourites',
  incompleteness: 'incompleteness',
} as const;

const TOP_TRENDING_LIMIT = 4;

export { USER_ID, MOVIE_FIELD, TOP_TRENDING_LIMIT };
