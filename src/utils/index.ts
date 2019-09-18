import * as middlewares from "./middlewares";
import * as helpers from "./helpers";
import * as shared from "./validator";
import logger from "./logger";

export default {
  ...middlewares,
  ...helpers,
  logger: logger,
  schema: shared
};
