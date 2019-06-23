import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Warehouse';

const { Warehouse } = db.sequelize.models;
const { NotFoundError } = errors;

export const getWarehouses = [
  validate.getWarehouses,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Warehouse.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createWarehouses = [
  validate.createWarehouses,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Warehouse.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getWarehouse = [
  validate.getWarehouse,
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.warehouse, error: false });
  }
];

export const updateWarehouse = [
  validate.updateWarehouse,
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteWarehouse = [
  validate.deleteWarehouse,
  async function params(req, res, next) {
    try {
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.destroy(req.values.query),
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
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.getItems(req.values.query),
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
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.warehouse.addItems(req.values.body.items),
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
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
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
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
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
        data: await req.warehouse.addItem(req.values.params.item, {
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
      req.warehouse = await Warehouse.findByPk(req.values.params.warehouse);

      if (!req.warehouse) {
        throw new NotFoundError('Warehouse not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.warehouse.getItems({
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
        data: await req.warehouse.removeItem(req.values.params.item),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
