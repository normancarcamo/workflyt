import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Item';

const { Item } = db.sequelize.models;
const { NotFoundError } = errors;

export const getItems = [
  validate(validations.getItems),
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
        data: await Item.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createItems = [
  validate(validations.createItems),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Item.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItem = [
  validate(validations.getItem),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.item, error: null });
  }
];

export const updateItem = [
  validate(validations.updateItem),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteItem = [
  validate(validations.deleteItem),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
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
        data: await req.item.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getStocks = [
  validate(validations.getStocks),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
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
        data: await req.item.getStocks(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setStocks = [
  validate(validations.setStocks),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.addStocks(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getStock = [
  validate(validations.getStock),
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.params.item);

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.stock = await req.item.getStocks({
        where: { id: req.params.stock },
        plain: true
      });

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
