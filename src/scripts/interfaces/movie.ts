import { Category } from '@/types';

export interface Movie {
  id: number;
  title: string;
  image: string;
  category: Category;
  type: string;
  release: number;
  rating: number;
  video: string;
  duration: string;
  description: string;
  isTrending: boolean;
  favorites: number[];
  incompleteness: number[];
}

export interface FilteredMovieList {
  trending: Movie[];
  favorites: Movie[];
  continueWatching: Movie[];
}
