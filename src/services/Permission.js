import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Permission';

const { Permission } = db.sequelize.models;
const { NotFoundError } = errors;

export const getPermissions = [
  validate.getPermissions,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Permission.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createPermissions = [
  validate.createPermissions,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Permission.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getPermission = [
  validate.getPermission,
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.values.params.permission);

      if (!req.permission) {
        throw new NotFoundError('Permission not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.permission, error: false });
  }
];

export const updatePermission = [
  validate.updatePermission,
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.values.params.permission);

      if (!req.permission) {
        throw new NotFoundError('Permission not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.permission.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deletePermission = [
  validate.deletePermission,
  async function params(req, res, next) {
    try {
      req.permission = await Permission.findByPk(req.values.params.permission);

      if (!req.permission) {
        throw new NotFoundError('Permission not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.permission.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
