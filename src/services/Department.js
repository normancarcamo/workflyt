import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Department';

const { Department } = db.sequelize.models;
const { NotFoundError } = errors;

export const getDepartments = [
  validate.getDepartments,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Department.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createDepartments = [
  validate.createDepartments,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Department.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getDepartment = [
  validate.getDepartment,
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.department, error: false });
  }
];

export const updateDepartment = [
  validate.updateDepartment,
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteDepartment = [
  validate.deleteDepartment,
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getEmployees = [
  validate.getEmployees,
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.getEmployees(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setEmployees = [
  validate.setEmployees,
  async function params(req, res, next) {
    try {
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.department.addEmployees(
          req.values.body.employees
        ),
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
      req.department = await Department.findByPk(
        req.values.params.department
      );

      if (!req.department) {
        throw new NotFoundError('Department not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.department.getEmployees({
        where: { id: req.values.params.employee },
        plain: true
      });

      if (!req.employee) {
        throw new NotFoundError('Employee not found.');
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
