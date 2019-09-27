import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './quotes-validator';
import { QuoteRepository } from './quotes-repository';
import { QuoteService } from './quotes-service';
import { QuoteController } from './quotes-controller';
import { QuoteRouter } from './quotes-router';

export default QuoteRouter(
  QuoteController(
    QuoteService(
      QuoteRepository(database)
    ), validator, helpers
  )
);
