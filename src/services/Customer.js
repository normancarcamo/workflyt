import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Customer'

const { Customer } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCustomers = [
  validate(schema.getCustomers),
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
        data: await Customer.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCustomers = [
  validate(schema.createCustomer),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Customer.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCustomer = [
  validate(schema.getCustomer),
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.customer, error: null });
  }
];

export const updateCustomer = [
  validate(schema.updateCustomer),
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCustomer = [
  validate(schema.deleteCustomer),
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
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
        data: await req.customer.destroy(req.options),
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
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
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
        data: await req.customer.getQuotes(req.options),
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
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.addQuotes(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getQuote = [
  validate(schema.getQuote),
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.params.customer);

      if (req.customer) {
        next();
      } else {
        throw new NotFoundError('Customer not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.quote = await req.customer.getQuotes({
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
    res.json({
      data: req.quote,
      error: null
    });
  }
];
