import { MovieController } from '@/controllers';
import { MovieModel } from '@/models';
import { MovieView } from '@/views';

new MovieController(new MovieModel(), new MovieView());
