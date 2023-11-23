// Initialized as an alternative to mock API get id for User
// Because this practice does not create an api about the users
const USER_ID = 1;

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

const DEFAULT_USER_ID = 0;

const DEFAULT_RATING = 0;

const DEFAULT_FAVOURITES: number[] = [];

const DEFAULT_INCOMPLETENESS: number[] = [];

const TOP_TRENDING_LIMIT = 4;

export {
  USER_ID,
  MOVIE_FIELD,
  DEFAULT_USER_ID,
  DEFAULT_RATING,
  DEFAULT_FAVOURITES,
  DEFAULT_INCOMPLETENESS,
  TOP_TRENDING_LIMIT,
};
