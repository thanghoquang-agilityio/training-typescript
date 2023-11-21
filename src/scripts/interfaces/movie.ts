import { Category } from '@/types';

export interface Movie {
  id: number;
  title: string;
  image: string;
  category: Category;
  type: string;
  release: number;
  rating?: number;
  video: string;
  duration: string;
  description: string;
  isTrending: boolean;
  favourites: number[];
  incompleteness: number[];
}

export interface MovieForm extends Omit<Movie, 'id'> {}

export interface MovieData {
  trending: Movie[];
  favourites: Movie[];
  continueWatching: Movie[];
}
