import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Supplier';

const { Supplier } = db.sequelize.models;
const { NotFoundError } = errors;

export const getSuppliers = [
  validate(schema.getSuppliers),
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
        data: await Supplier.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createSuppliers = [
  validate(schema.createSuppliers),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Supplier.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getSupplier = [
  validate(schema.getSupplier),
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.supplier, error: null });
  }
];

export const updateSupplier = [
  validate(schema.updateSupplier),
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteSupplier = [
  validate(schema.deleteSupplier),
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
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
        data: await req.supplier.destroy(req.options),
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
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
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
        data: await req.supplier.getItems(req.options),
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
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.addItems(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItem = [
  validate(schema.getItem),
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
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
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
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
        data: await req.supplier.addItem(req.params.item, {
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
      req.supplier = await Supplier.findByPk(req.params.supplier);

      if (req.supplier) {
        next();
      } else {
        throw new NotFoundError('Supplier not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
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
        data: await req.supplier.removeItem(req.params.item),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
