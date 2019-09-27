import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './warehouses-validator';
import { WarehouseRepository } from './warehouses-repository';
import { WarehouseService } from './warehouses-service';
import { WarehouseController } from './warehouses-controller';
import { WarehouseRouter } from './warehouses-router';

export default WarehouseRouter(
  WarehouseController(
    WarehouseService(
      WarehouseRepository(database)
    ), validator, helpers
  )
);
