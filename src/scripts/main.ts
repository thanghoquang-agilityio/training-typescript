import dotenv from 'dotenv';

import MovieController from '@/controllers/movie';
import MovieModel from '@/models/movie';
import MovieView from '@/views/movie';

dotenv.config();

new MovieController(new MovieModel(), new MovieView());
