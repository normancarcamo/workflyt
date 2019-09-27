import database from 'src/providers/postgres';
import helpers from 'src/utils';
import * as validator from './orders-validator';
import { OrderRepository } from './orders-repository';
import { OrderService } from './orders-service';
import { OrderController } from './orders-controller';
import { OrderRouter } from './orders-router';

export default OrderRouter(
  OrderController(
    OrderService(
      OrderRepository(database)
    ), validator, helpers
  )
);
