import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Category'

const { Category } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCategories = [
  validate(schema.getCategories),
  async function query(req, res, next) {
    req.options = { where: {}, include: [] };

    if (req.query.search) {
      for (let key in req.query.search) {
        if (is.object(req.query.search[key])) {
          req.options.where[key] = {};
          for (let operator in req.query.search[key]) {
            req.options.where[key][db.Sequelize.Op[operator]] = req.query.search[key][operator];
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
        data: await Category.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCategories = [
  validate(schema.createCategories),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Category.create(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCategory = [
  validate(schema.getCategory),
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.status(200).json({ data: req.category, error: null });
  }
];

export const updateCategory = [
  validate(schema.updateCategory),
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.status(200).json({
        data: await req.category.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCategory = [
  validate(schema.deleteCategory),
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
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
      res.status(200).json({
        data: await req.category.destroy(req.options),
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
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
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
            req.options.where[key][db.Sequelize.Op[operator]] = req.query.search[key][operator];
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
      let result = await req.category.getItems(req.options);
      res.json({ data: result, error: null });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate(schema.setItems),
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.category.addItems(req.body.items),
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
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.category.getItems({
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

export const removeItem = [
  validate(schema.removeItem),
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.params.category);

      if (req.category) {
        next();
      } else {
        throw new NotFoundError('Category not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.category.getItems({
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
        data: await req.item.setCategory(null),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
