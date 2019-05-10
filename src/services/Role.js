import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Role';

const { Role, RolePermissions } = db.sequelize.models;
const { NotFoundError } = errors;

export const getRoles = [
  validate(validations.getRoles),
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
        data: await Role.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createRoles = [
  validate(validations.createRoles),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Role.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getRole = [
  validate(validations.getRole),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.role, error: null });
  }
];

export const updateRole = [
  validate(validations.updateRole),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteRole = [
  validate(validations.deleteRole),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
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
        data: await req.role.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getPermissions = [
  validate(validations.getPermissions),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
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
        data: await req.role.getPermissions(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setPermissions = [
  validate(validations.setPermissions),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.addPermissions(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getPermission = [
  validate(validations.getPermission),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.params.permission },
        plain: true
      });

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
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.params.permission },
        plain: true
      });

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
        data: await req.permission.RolePermissions.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removePermission = [
  validate(validations.removePermission),
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.params.role);

      if (req.role) {
        next();
      } else {
        throw new NotFoundError('Role not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.params.permission },
        plain: true
      });

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
        data: await req.role.removePermission(req.params.permission),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
