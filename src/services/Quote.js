import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Quote';

const { Quote } = db.sequelize.models;
const { NotFoundError } = errors;

export const getQuotes = [
  validate.getQuotes,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Quote.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createQuotes = [
  validate.createQuotes,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Quote.createMany(req.values.body),
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
      req.quote = await Quote.findByPk(req.values.params.quote);

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

export const updateQuote = [
  validate.updateQuote,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteQuote = [
  validate.deleteQuote,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.destroy(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItems = [
  validate.getItems,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.getItems(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate.setItems,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.addItems(req.values.body.items),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getItem = [
  validate.getItem,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.item, error: false });
  }
];

export const updateItem = [
  validate.updateItem,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.addItem(req.values.params.item, {
          through: req.values.body
        }),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeItem = [
  validate.removeItem,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.quote.getItems({
        where: { id: req.values.params.item },
        plain: true
      });

      if (!req.item) {
        throw new NotFoundError('Item not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.removeItem(req.values.params.item),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getOrders = [
  validate.getOrders,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.getOrders(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setOrders = [
  validate.setOrders,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.quote.addOrders(req.values.body.orders),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getOrder = [
  validate.getOrder,
  async function params(req, res, next) {
    try {
      req.quote = await Quote.findByPk(req.values.params.quote);

      if (!req.quote) {
        throw new NotFoundError('Quote not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.order = await req.quote.getOrders({
        where: { id: req.values.params.order },
        plain: true
      });

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    res.json({ data: req.order, error: false });
  }
];
