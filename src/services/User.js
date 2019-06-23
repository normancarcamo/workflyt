import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/User';
import bcrypt from "bcrypt";

const { User } = db.sequelize.models;
const { NotFoundError, ValidationError } = errors;

export const getUsers = [
  validate.getUsers,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await User.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createUsers = [
  validate.createUsers,
  async function handler(req, res, next) {
    try {
      let user = await User.findOne({
        where: {
          username: req.values.body.username
        }
      });

      if (user) {
        throw new ValidationError("user is already taken.");
      }

      req.values.body.password = await bcrypt.hash(
        req.values.body.password, 10
      );

      res.status(201).json({
        data: await User.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getUser = [
  validate.getUser,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.user, error: false });
  }
];

export const updateUser = [
  validate.updateUser,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteUser = [
  validate.deleteUser,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getRoles = [
  validate.getRoles,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.getRoles(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setRoles = [
  validate.setRoles,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.addRoles(req.values.body.roles),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getRole = [
  validate.getRole,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.values.params.role },
        plain: true
      });

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
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.values.params.role },
        plain: true
      });

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
        data: await req.role.UserRoles.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeRole = [
  validate.removeRole,
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.values.params.user);

      if (!req.user) {
        throw new NotFoundError('User not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.values.params.role },
        plain: true
      });

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
        data: await req.user.removeRole(req.values.params.role),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
