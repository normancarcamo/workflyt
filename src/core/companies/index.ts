import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './companies-validator';
import { CompanyRepository } from './companies-repository';
import { CompanyService } from './companies-service';
import { CompanyController } from './companies-controller';
import { CompanyRouter } from './companies-router';

export default CompanyRouter(
  CompanyController(
    CompanyService(
      CompanyRepository(database)
    ), validator, helpers
  )
);
