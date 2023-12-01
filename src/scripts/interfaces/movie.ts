import { Category } from '@/types';

interface IMovie {
  id: number;
  title: string;
  image: string;
  category: Category;
  type: string;
  release: number;
  rating: number;
  video: string;
  duration: number;
  description: string;
  isTrending: boolean;
  favorites: number[];
  incompleteness: number[];
}

interface IMovieOptionalField extends Partial<IMovie> {}

export type { IMovie, IMovieOptionalField };
