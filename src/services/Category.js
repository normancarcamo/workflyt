import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Category';

const { Category } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCategories = [
  validate.getCategories,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Category.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCategories = [
  validate.createCategories,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Category.create(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCategory = [
  validate.getCategory,
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.status(200).json({ data: req.category, error: false });
  }
];

export const updateCategory = [
  validate.updateCategory,
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.status(200).json({
        data: await req.category.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCategory = [
  validate.deleteCategory,
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.status(200).json({
        data: await req.category.destroy(req.values.query),
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
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      let result = await req.category.getItems(req.values.query);
      res.json({ data: result, error: false });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate.setItems,
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.category.addItems(req.values.body.items),
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
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.category.getItems({
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

export const removeItem = [
  validate.removeItem,
  async function params(req, res, next) {
    try {
      req.category = await Category.findByPk(req.values.params.category);

      if (!req.category) {
        throw new NotFoundError('Category not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.category.getItems({
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
        data: await req.item.setCategory(null),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
