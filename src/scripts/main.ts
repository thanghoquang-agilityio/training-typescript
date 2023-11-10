import dotenv from 'dotenv';

import { MovieController } from '@/controllers';
import { MovieModel } from '@/models';
import { MovieView } from '@/views';

dotenv.config();

new MovieController(new MovieModel(), new MovieView());
