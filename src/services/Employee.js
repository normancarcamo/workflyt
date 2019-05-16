import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Employee';

const { Employee, User, Quote } = db.sequelize.models;
const { NotFoundError } = errors;
const associations = Object.keys(Employee.associations);

export const getEmployees = [
  validate(schema.getEmployees),
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

    if (req.query.include) {
      const include = req.query.include.trim().split(',');
      const notFound = include.find(
        model => model && associations.indexOf(model) < 0
      );

      if (notFound) {
        return next(new Error(`Association "${notFound}" not found.`));
      } else {
        req.options.include = include.filter(model => model && model);
      }
    }

    next();
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Employee.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createEmployees = [
  validate(schema.createEmployees),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Employee.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getEmployee = [
  validate(schema.getEmployee),
  async function query(req, res, next) {
    req.options = {};

    if (req.query.include) {
      const include = req.query.include.trim().split(',');
      const notFound = include.find(
        model => model && associations.indexOf(model) < 0
      );

      if (notFound) {
        return next(new Error(`Association "${notFound}" not found.`));
      } else {
        req.options.include = include.filter(model => model && model);
      }
    }

    next();
  },
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee, req.options);
      if (req.employee) {
        next();
      } else {
        throw new Error('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.employee, error: null });
  }
];

export const updateEmployee = [
  validate(schema.updateEmployee),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteEmployee = [
  validate(schema.deleteEmployee),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
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
        data: await req.employee.destroy(req.options),
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
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({ data: await req.employee.getUser(), error: null });
    } catch (error) {
      next(error);
    }
  }
];

export const setUser = [
  validate(schema.setUser),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.setUser(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const removeUser = [
  validate(schema.removeUser),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.setUser(null),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getQuotes = [
  validate(schema.getQuotes),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
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
        data: await req.employee.getQuotes(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setQuotes = [
  validate(schema.setQuotes),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.addQuotes(req.body.quotes),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getQuote = [
  validate(schema.getQuote),
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(req.params.employee);

      if (req.employee) {
        next();
      } else {
        throw new NotFoundError('Employee not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.quote = await req.employee.getQuotes({
        where: { id: req.params.quote },
        plain: true
      });

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.quote, error: null });
  }
];
