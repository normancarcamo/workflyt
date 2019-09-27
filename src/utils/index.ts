import * as middlewares from "./middlewares";
import * as helpers from "./helpers";
import * as schemas from "./schemas";
import loggerOptions from "./logger";
import { IUtils } from './types';

export default <IUtils> {
  ...middlewares,
  ...helpers,
  logger: loggerOptions,
  schema: schemas
};
