import { IMovie } from '@/interfaces';

// Mapping with category of NAVBAR_ITEMS in file constants "route.ts"
type Category = 'movies' | 'series' | 'documentaries';

type MoviePage = 'homePage' | 'favoritesPage' | 'trendingPage';

type FilteredMovieList = {
  trending: IMovie[];
  favorites: IMovie[];
  continueWatching: IMovie[];
};

export { Category, FilteredMovieList, MoviePage };
