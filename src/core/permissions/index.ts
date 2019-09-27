import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './permissions-validator';
import { PermissionRepository } from './permissions-repository';
import { PermissionService } from './permissions-service';
import { PermissionController } from './permissions-controller';
import { PermissionRouter } from './permissions-router';

export default PermissionRouter(
  PermissionController(
    PermissionService(
      PermissionRepository(database)
    ), validator, helpers
  )
);
