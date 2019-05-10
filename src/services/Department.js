import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Department';

const { Department } = db.sequelize.models;
const { NotFoundError } = errors;

export const getDepartments = [
  validate(validations.getDepartments),
  async function query(req, res, next) {
    req.options = { where: {}, include: [] };

    if (req.query.search) {
      for (let key in req.query.search) {
        if (is.object(req.query.search[key])) {
          req.options.where[key] = {};
          for (let operator in req.query.search[key]) {
            req.options.where[key][db.Sequelize.Op[operator]] = req.query.search[key][operator];
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
        data: await Department.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createDepartments = [
  validate(validations.createDepartments),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Department.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getDepartment = [
  validate(validations.getDepartment),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.department, error: null });
  }
];

export const updateDepartment = [
  validate(validations.updateDepartment),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteDepartment = [
  validate(validations.deleteDepartment),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
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
        data: await req.department.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getEmployees = [
  validate(validations.getEmployees),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
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
        data: await req.department.getEmployees(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setEmployees = [
  validate(validations.setEmployees),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.addEmployees(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getEmployee = [
  validate(validations.getEmployee),
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(req.params.department);

      if (req.department) {
        next();
      } else {
        throw new NotFoundError('Department not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.department.getEmployees({
        where: { id: req.params.employee },
        plain: true
      });

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
