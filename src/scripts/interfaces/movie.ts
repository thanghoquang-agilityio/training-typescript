import { Category } from '@/types';

export interface Movie {
  id: string;
  title: string;
  displayImage: string;
  category: Category;
  type: string;
  releaseYear: number;
  rating?: number;
  video: string;
  videoDuration?: string;
  description: string;
  favourites?: string;
  incompleteness?: string;
}
