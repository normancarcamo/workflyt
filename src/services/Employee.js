import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Employee';

const { Employee } = db.sequelize.models;
const { NotFoundError } = errors;

export const getEmployees = [
  validate(validations.getEmployees),
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
        data: await Employee.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createEmployees = [
  validate(validations.createEmployees),
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
  validate(validations.getEmployee),
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
    res.json({ data: req.employee, error: null });
  }
];

export const updateEmployee = [
  validate(validations.updateEmployee),
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
  validate(validations.deleteEmployee),
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

export const setUser = [
  validate(validations.setUser),
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

export const getUser = [
  validate(validations.getUser),
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
      req.user = await req.employee.getUser();

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

export const getQuotes = [
  validate(validations.getQuotes),
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
  validate(validations.setQuotes),
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
        data: await req.employee.addQuotes(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getQuote = [
  validate(validations.getQuote),
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
