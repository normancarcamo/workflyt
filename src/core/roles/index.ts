import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './roles-validator';
import { RoleRepository } from './roles-repository';
import { RoleService } from './roles-service';
import { RoleController } from './roles-controller';
import { RoleRouter } from './roles-router';

export default RoleRouter(
  RoleController(
    RoleService(
      RoleRepository(database)
    ), validator, helpers
  )
);
