import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Permission';

const { Permission } = db.sequelize.models;
const { NotFoundError } = errors;

export const getPermissions = [
  validate(validations.getPermissions),
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
        data: await Permission.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createPermissions = [
  validate(validations.createPermissions),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Permission.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getPermission = [
  validate(validations.getPermission),
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.params.permission);

      if (req.permission) {
        next();
      } else {
        throw new NotFoundError('Permission not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.permission, error: null });
  }
];

export const updatePermission = [
  validate(validations.updatePermission),
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.params.permission);

      if (req.permission) {
        next();
      } else {
        throw new NotFoundError('Permission not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.permission.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deletePermission = [
  validate(validations.deletePermission),
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.params.permission);

      if (req.permission) {
        next();
      } else {
        throw new NotFoundError('Permission not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function query(req, res, next) {
    req.options = {};

    if (req.query.force) {
      req.options.force = JSON.parse(req.query.force)
    }

    next();
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.permission.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
