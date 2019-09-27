import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './services-validator';
import { ServiceRepository } from './services-repository';
import { ServiceService } from './services-service';
import { ServiceController } from './services-controller';
import { ServiceRouter } from './services-router';

export default ServiceRouter(
  ServiceController(
    ServiceService(
      ServiceRepository(database)
    ), validator, helpers
  )
);
