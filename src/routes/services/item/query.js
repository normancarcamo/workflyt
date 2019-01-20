import db from "src/db/models";
import { is } from '@playscode/fns';

const { Op } = db.Sequelize;

export function get_items(req, res, next) {
  const options = { where: {}, include: [] };

  if (req.query.search) {
    for (let key in req.query.search) {
      if (is.object(req.query.search[key])) {
        options.where[key] = {};
        for (let operator in req.query.search[key]) {
          options.where[key][Op[operator]] = req.query.search[key][operator];
        }
      } else {
        options.where[key] = req.query.search[key];
      }
    }
  }

  req.options = options;
  next();
}

export function delete_item(req, res, next) {
  req.options = { force: JSON.parse(req.query.force) };
  next();
}
