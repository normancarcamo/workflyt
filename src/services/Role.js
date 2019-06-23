import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Role';

const { Role } = db.sequelize.models;
const { NotFoundError } = errors;

export const getRoles = [
  validate.getRoles,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Role.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createRoles = [
  validate.createRoles,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Role.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getRole = [
  validate.getRole,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.role, error: false });
  }
];

export const updateRole = [
  validate.updateRole,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteRole = [
  validate.deleteRole,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getPermissions = [
  validate.getPermissions,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.getPermissions(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setPermissions = [
  validate.setPermissions,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.role.addPermissions(req.values.body.permissions),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getPermission = [
  validate.getPermission,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.values.params.permission },
        plain: true
      });

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
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.values.params.permission },
        plain: true
      });

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
        data: await req.permission.RolePermissions.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removePermission = [
  validate.removePermission,
  async function params(req, res, next) {
    try {
      req.role = await Role.findByPk(req.values.params.role);

      if (!req.role) {
        throw new NotFoundError('Role not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.permission = await req.role.getPermissions({
        where: { id: req.values.params.permission },
        plain: true
      });

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
        data: await req.role.removePermission(req.values.params.permission),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
