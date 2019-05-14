import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Company';

const { Company } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCompanies = [
  validate(schema.getCompanies),
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
        data: await Company.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCompanies = [
  validate(schema.createCompanies),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Company.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCompany = [
  validate(schema.getCompany),
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.params.company);

      if (req.company) {
        next();
      } else {
        throw new NotFoundError('Company not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.company, error: null });
  }
];

export const updateCompany = [
  validate(schema.updateCompany),
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.params.company);

      if (req.company) {
        next();
      } else {
        throw new NotFoundError('Company not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.company.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCompany = [
  validate(schema.deleteCompany),
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.params.company);

      if (req.company) {
        next();
      } else {
        throw new NotFoundError('Company not found.');
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
        data: await req.company.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
