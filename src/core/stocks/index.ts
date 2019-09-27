import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './stocks-validator';
import { StockRepository } from './stocks-repository';
import { StockService } from './stocks-service';
import { StockController } from './stocks-controller';
import { StockRouter } from './stocks-router';

export default StockRouter(
  StockController(
    StockService(
      StockRepository(database)
    ), validator, helpers
  )
);
