import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './materials-validator';
import { MaterialRepository } from './materials-repository';
import { MaterialService } from './materials-service';
import { MaterialController } from './materials-controller';
import { MaterialRouter } from './materials-router';

export default MaterialRouter(
  MaterialController(
    MaterialService(
      MaterialRepository(database)
    ), validator, helpers
  )
);
