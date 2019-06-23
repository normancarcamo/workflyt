import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Company';

const { Company } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCompanies = [
  validate.getCompanies,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Company.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCompanies = [
  validate.createCompanies,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Company.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCompany = [
  validate.getCompany,
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.values.params.company);

      if (!req.company) {
        throw new NotFoundError('Company not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.company, error: false });
  }
];

export const updateCompany = [
  validate.updateCompany,
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.values.params.company);

      if (!req.company) {
        throw new NotFoundError('Company not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.company.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCompany = [
  validate.deleteCompany,
  async function params(req, res, next) {
    try {
      req.company = await Company.findByPk(req.values.params.company);

      if (!req.company) {
        throw new NotFoundError('Company not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.company.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
