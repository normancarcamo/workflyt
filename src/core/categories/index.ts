import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './categories-validator';
import { CategoryRepository } from './categories-repository';
import { CategoryService } from './categories-service';
import { CategoryController } from './categories-controller';
import { CategoryRouter } from './categories-router';

export default CategoryRouter(
  CategoryController(
    CategoryService(
      CategoryRepository(database)
    ), validator, helpers
  )
);
