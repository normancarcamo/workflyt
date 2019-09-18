// dependencies:
import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './auth-validator';
import UserRepository from '../users/users-repository';
import { AuthRepository } from './auth-repository';
import { AuthService } from './auth-service';
import { AuthController } from './auth-controller';
import { AuthRouter } from './auth-router';

// compose:
const repository = AuthRepository({ User: UserRepository({ database }) });
const service = AuthService({ repository, helpers });
const controller = AuthController({ service, helpers, validator });
const router = AuthRouter(controller);

export default router;
