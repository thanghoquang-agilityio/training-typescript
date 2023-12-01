import { ROUTES } from '@/constants';
import { IMovie } from '@/interfaces';

// Mapping with category of NAVBAR_ITEMS in file constants "route.ts"
type Category = 'movies' | 'series' | 'documentaries';

type FilteredMovieList = {
  trending: IMovie[];
  favorites: IMovie[];
  continueWatching: IMovie[];
};

type PathnameValid = (typeof ROUTES)[keyof typeof ROUTES];

export type { Category, FilteredMovieList, PathnameValid };
