import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './areas-validator';
import { AreaRepository } from './areas-repository';
import { AreaService } from './areas-service';
import { AreaController } from './areas-controller';
import { AreaRouter } from './areas-router';

export default AreaRouter(
  AreaController(
    AreaService(
      AreaRepository(database)
    ), validator, helpers
  )
);
