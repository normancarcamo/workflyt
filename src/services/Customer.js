import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Customer';

const { Customer } = db.sequelize.models;
const { NotFoundError } = errors;

export const getCustomers = [
  validate.getCustomers,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Customer.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createCustomers = [
  validate.createCustomer,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Customer.createMany(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getCustomer = [
  validate.getCustomer,
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.customer, error: false });
  }
];

export const updateCustomer = [
  validate.updateCustomer,
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteCustomer = [
  validate.deleteCustomer,
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.destroy(req.values.query),
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
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.getQuotes(req.values.query),
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
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.customer.addQuotes(req.values.body.quotes),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getQuote = [
  validate.getQuote,
  async function params(req, res, next) {
    try {
      req.customer = await Customer.findByPk(req.values.params.customer);

      if (!req.customer) {
        throw new NotFoundError('Customer not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.quote = await req.customer.getQuotes({
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
