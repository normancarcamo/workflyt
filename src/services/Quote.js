import { validate } from "src/utils/validator";
import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import * as validations from 'src/validations/Quote';

const { Quote, QuoteItems } = db.sequelize.models;
const { NotFoundError } = errors;

export const getQuotes = [
  validate(validations.getQuotes),
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
        data: await Quote.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createQuotes = [
  validate(validations.createQuotes),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Quote.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getQuote = [
  validate(validations.getQuote),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

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

export const updateQuote = [
  validate(validations.updateQuote),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

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
    try {
      res.json({
        data: await req.quote.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteQuote = [
  validate(validations.deleteQuote),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
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
        data: await req.quote.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItems = [
  validate(validations.getItems),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
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
        data: await req.quote.getItems(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate(validations.setItems),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

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
    try {
      res.json({
        data: await req.quote.addItems(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getItem = [
  validate(validations.getItem),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.params.item },
        plain: true
      });

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.item, error: null });
  }
];

export const updateItem = [
  validate(validations.updateItem),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.params.item },
        plain: true
      });

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.addItem(req.params.item, {
          through: req.body.values
        }),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeItem = [
  validate(validations.removeItem),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.params.item },
        plain: true
      });

      if (req.item) {
        next();
      } else {
        throw new NotFoundError('Item not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.removeItem(req.params.item),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getOrders = [
  validate(validations.getOrders),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
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
        data: await req.quote.getOrders(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setOrders = [
  validate(validations.setOrders),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

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
    try {
      res.json({
        data: await req.quote.addOrders(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getOrder = [
  validate(validations.getOrder),
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.params.quote);

      if (req.quote) {
        next();
      } else {
        throw new NotFoundError('Quote not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.order = await req.quote.getOrders({
        where: { id: req.params.order },
        plain: true
      });

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.order, error: null });
  }
];
