import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/User';

const { User, UserRoles } = db.sequelize.models;
const { NotFoundError } = errors;

export const getUsers = [
  validate(schema.getUsers),
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
        data: await User.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createUsers = [
  validate(schema.createUsers),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await User.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getUser = [
  validate(schema.getUser),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.user, error: null });
  }
];

export const updateUser = [
  validate(schema.updateUser),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteUser = [
  validate(schema.deleteUser),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
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
        data: await req.user.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getRoles = [
  validate(schema.getRoles),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
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
        data: await req.user.getRoles(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setRoles = [
  validate(schema.setRoles),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.user.addRoles(req.body.roles),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getRole = [
  validate(schema.getRole),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.params.role },
        plain: true
      });

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
  validate(schema.updateRole),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.params.role },
        plain: true
      });

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
        data: await req.role.UserRoles.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeRole = [
  validate(schema.removeRole),
  async function params(req, res, next) {
    try {
      req.user = await User.findByPk(req.params.user);

      if (req.user) {
        next();
      } else {
        throw new NotFoundError('User not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.role = await req.user.getRoles({
        where: { id: req.params.role },
        plain: true
      });

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
        data: await req.user.removeRole(req.params.role),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
