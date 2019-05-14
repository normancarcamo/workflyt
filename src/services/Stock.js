import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Stock';

const { Stock } = db.sequelize.models;
const { NotFoundError } = errors;

export const getStocks = [
  validate(schema.getStocks),
  async function query(req, res, next) {
    req.options = { where: {}, include: [] };

    if (req.query.search) {
      for (let key in req.query.search) {
        if (is.object(req.query.search[key])) {
          req.options.where[key] = {};
          for (let operator in req.query.search[key]) {
            req.options.where[key][
              db.Sequelize.Op[operator]
            ] = req.query.search[key][operator];
          }
        } else {
          req.options.where[key] = req.query.search[key];
        }
      }
    }

    next();
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Stock.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createStocks = [
  validate(schema.createStocks),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Stock.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getStock = [
  validate(schema.getStock),
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.params.stock);

      if (req.stock) {
        next();
      } else {
        throw new NotFoundError('Stock not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.stock, error: null });
  }
];

export const updateStock = [
  validate(schema.updateStock),
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.params.stock);

      if (req.stock) {
        next();
      } else {
        throw new NotFoundError('Stock not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.stock.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteStock = [
  validate(schema.deleteStock),
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.params.stock);

      if (req.stock) {
        next();
      } else {
        throw new NotFoundError('Stock not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function query(req, res, next) {
    req.options = {};

    if (req.query.force) {
      req.options.force = JSON.parse(req.query.force);
    }

    next();
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.stock.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
