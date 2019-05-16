import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Warehouse';

const { Warehouse } = db.sequelize.models;
const { NotFoundError } = errors;

export const getWarehouses = [
  validate(schema.getWarehouses),
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
        data: await Warehouse.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createWarehouses = [
  validate(schema.createWarehouses),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Warehouse.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getWarehouse = [
  validate(schema.getWarehouse),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.warehouse, error: null });
  }
];

export const updateWarehouse = [
  validate(schema.updateWarehouse),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteWarehouse = [
  validate(schema.deleteWarehouse),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
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
        data: await req.warehouse.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItems = [
  validate(schema.getItems),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
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
        data: await req.warehouse.getItems(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate(schema.setItems),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.addItems(req.body.items),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getItem = [
  validate(schema.getItem),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
        where: { id: req.params.item },
        plain: true
      });

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
  validate(schema.updateItem),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
        where: { id: req.params.item },
        plain: true
      });

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
        data: await req.warehouse.addItem(req.params.item, {
          through: req.body.values
        }),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeItem = [
  validate(schema.removeItem),
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.params.warehouse);

      if (req.warehouse) {
        next();
      } else {
        throw new NotFoundError('Warehouse not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
        where: { id: req.params.item },
        plain: true
      });

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
        data: await req.warehouse.removeItem(req.params.item),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
