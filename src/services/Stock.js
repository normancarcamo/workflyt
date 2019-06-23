import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Stock';

const { Stock } = db.sequelize.models;
const { NotFoundError } = errors;

export const getStocks = [
  validate.getStocks,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Stock.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createStocks = [
  validate.createStocks,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Stock.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getStock = [
  validate.getStock,
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.values.params.stock);

      if (!req.stock) {
        throw new NotFoundError('Stock not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.stock, error: false });
  }
];

export const updateStock = [
  validate.updateStock,
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.values.params.stock);

      if (!req.stock) {
        throw new NotFoundError('Stock not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.stock.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteStock = [
  validate.deleteStock,
  async function params(req, res, next) {
    try {
      req.stock = await Stock.findByPk(req.values.params.stock);

      if (!req.stock) {
        throw new NotFoundError('Stock not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.stock.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
