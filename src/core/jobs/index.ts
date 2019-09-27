import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './jobs-validator';
import { JobRepository } from './jobs-repository';
import { JobService } from './jobs-service';
import { JobController } from './jobs-controller';
import { JobRouter } from './jobs-router';

export default JobRouter(
  JobController(
    JobService(
      JobRepository(database)
    ), validator, helpers
  )
);
