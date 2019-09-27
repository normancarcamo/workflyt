import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './users-validator';
import { UserRepository } from './users-repository';
import { UserService } from './users-service';
import { UserController } from './users-controller';
import { UserRouter } from './users-router';

export default UserRouter(
  UserController(
    UserService(
      UserRepository(database), helpers
    ), validator, helpers
  )
);
