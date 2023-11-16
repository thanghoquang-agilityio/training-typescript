import { Category } from '@/types';

export interface Movie {
  id: string;
  title: string;
  image: string;
  category: Category;
  type: string;
  release: number;
  rating?: number;
  video: string;
  duration?: string;
  description: string;
  isTrending: boolean;
  favourites: string[];
  incompleteness: string[];
}

export interface MovieData {
  trending: Movie[];
  favourites: Movie[];
  continueWatching: Movie[];
}
