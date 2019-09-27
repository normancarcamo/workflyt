import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './workers-validator';
import { WorkerRepository } from './workers-repository';
import { WorkerService } from './workers-service';
import { WorkerController } from './workers-controller';
import { WorkerRouter } from './workers-router';

export default WorkerRouter(
  WorkerController(
    WorkerService(
      WorkerRepository(database)
    ), validator, helpers
  )
);
