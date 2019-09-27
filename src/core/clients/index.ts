import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './clients-validator';
import { ClientRepository } from './clients-repository';
import { ClientService } from './clients-service';
import { ClientController } from './clients-controller';
import { ClientRouter } from './clients-router';

export default ClientRouter(
  ClientController(
    ClientService(
      ClientRepository(database)
    ), validator, helpers
  )
);
