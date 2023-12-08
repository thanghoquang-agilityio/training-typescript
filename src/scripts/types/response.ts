import { IMovie } from '@/interfaces';

type ResponseMovie = { code?: string; data: IMovie };
type ResponseMovieList = { code?: string; data: IMovie[] };

export { ResponseMovie, ResponseMovieList };
