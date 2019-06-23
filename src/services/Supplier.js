import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Supplier';

const { Supplier } = db.sequelize.models;
const { NotFoundError } = errors;

export const getSuppliers = [
  validate.getSuppliers,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Supplier.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createSuppliers = [
  validate.createSuppliers,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Supplier.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getSupplier = [
  validate.getSupplier,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.supplier, error: false });
  }
];

export const updateSupplier = [
  validate.updateSupplier,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteSupplier = [
  validate.deleteSupplier,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItems = [
  validate.getItems,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.getItems(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate.setItems,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.supplier.addItems(req.values.body.items),
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
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

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
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

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
        data: await req.supplier.addItem(req.values.params.item, {
          through: req.values.body
        }),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeItem = [
  validate.removeItem,
  async function params(req, res, next) {
    try {
      req.supplier = await Supplier.findByPk(req.values.params.supplier);

      if (!req.supplier) {
        throw new NotFoundError('Supplier not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.supplier.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

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
        data: await req.supplier.removeItem(req.values.params.item),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
