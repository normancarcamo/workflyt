import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Item';

const { Item } = db.sequelize.models;
const { NotFoundError } = errors;

export const getItems = [
  validate.getItems,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Item.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createItems = [
  validate.createItems,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Item.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItem = [
  validate.getItem,
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.item, error: false });
  }
];

export const updateItem = [
  validate.updateItem,
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteItem = [
  validate.deleteItem,
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getStocks = [
  validate.getStocks,
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.getStocks(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setStocks = [
  validate.setStocks,
  async function params(req, res, next) {
    try {
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.item.addStocks(req.values.body.stocks),
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
      req.item = await Item.findByPk(req.values.params.item);

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.stock = await req.item.getStocks({
        where: { id: req.values.params.stock },
        plain: true
      });

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
