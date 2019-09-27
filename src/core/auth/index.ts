import database from 'src/providers/postgres';
import helpers from 'src/utils/index';
import * as validator from './auth-validator';
import { UserRepository } from '../users/users-repository';
import { AuthRepository } from './auth-repository';
import { AuthService } from './auth-service';
import { AuthController } from './auth-controller';
import { AuthRouter } from './auth-router';

export default AuthRouter(
  AuthController(
    AuthService(
      AuthRepository(UserRepository(database)),
      helpers
    ), validator, helpers
  )
)
