import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './suppliers-validator';
import { SupplierRepository } from './suppliers-repository';
import { SupplierService } from './suppliers-service';
import { SupplierController } from './suppliers-controller';
import { SupplierRouter } from './suppliers-router';

export default SupplierRouter(
  SupplierController(
    SupplierService(
      SupplierRepository(database)
    ), validator, helpers
  )
);
