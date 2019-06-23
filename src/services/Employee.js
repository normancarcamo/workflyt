import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Employee';

const { Employee } = db.sequelize.models;
const { NotFoundError } = errors;

export const getEmployees = [
  validate.getEmployees,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Employee.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createEmployees = [
  validate.createEmployees,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Employee.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getEmployee = [
  validate.getEmployee,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee,
        req.values.query
      );

      if (!req.employee) {
        throw new Error('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.employee, error: false });
  }
];

export const updateEmployee = [
  validate.updateEmployee,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteEmployee = [
  validate.deleteEmployee,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.destroy(req.values.query),
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
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.getUser(),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setUser = [
  validate.setUser,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.setUser(req.values.body.user),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const removeUser = [
  validate.removeUser,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.setUser(null),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getQuotes = [
  validate.getQuotes,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.getQuotes(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setQuotes = [
  validate.setQuotes,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.employee.addQuotes(req.values.body.quotes),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getQuote = [
  validate.getQuote,
  async function params(req, res, next) {
    try {
      req.employee = await Employee.findByPk(
        req.values.params.employee
      );

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.quote = await req.employee.getQuotes({
        where: { id: req.values.params.quote },
        plain: true
      });

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.quote, error: false });
  }
];
