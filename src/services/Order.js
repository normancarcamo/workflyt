import db from "src/db/models";
import { is, errors } from '@playscode/fns';
import { schema, validate } from 'src/validations/Order';

const { Order, OrderItems } = db.sequelize.models;
const { NotFoundError } = errors;

export const getOrders = [
  validate(schema.getOrders),
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
        data: await Order.findAll(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createOrders = [
  validate(schema.createOrders),
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Order.createMany(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getOrder = [
  validate(schema.getOrder),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

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

export const updateOrder = [
  validate(schema.updateOrder),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

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
    try {
      res.json({
        data: await req.order.update(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteOrder = [
  validate(schema.deleteOrder),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
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
        data: await req.order.destroy(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getItems = [
  validate(schema.getItems),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
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
        data: await req.order.getItems(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setItems = [
  validate(schema.setItems),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

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
    try {
      res.json({
        data: await req.order.addItems(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getItem = [
  validate(schema.getItem),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
  validate(schema.updateItem),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
        data: await req.order.addItem(req.params.item, {
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
  validate(schema.removeItem),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
        data: await req.order.removeItem(req.params.item),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getDepartments = [
  validate(schema.getDepartments),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
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
        data: await req.order.getDepartments(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setDepartments = [
  validate(schema.setDepartments),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

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
    try {
      res.json({
        data: await req.order.addDepartments(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getDepartment = [
  validate(schema.getDepartment),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.params.department },
        plain: true
      });

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
  validate(schema.updateDepartment),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.params.department },
        plain: true
      });

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
        data: await req.order.addDepartment(req.params.department, {
          through: req.body.values
        }),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeDepartment = [
  validate(schema.removeDepartment),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.params.department },
        plain: true
      });

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
        data: await req.order.removeDepartment(req.params.department),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getEmployees = [
  validate(schema.getEmployees),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
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
        data: await req.order.getEmployees(req.options),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setEmployees = [
  validate(schema.setEmployees),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

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
    try {
      res.json({
        data: await req.order.addEmployees(req.body.values),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getEmployee = [
  validate(schema.getEmployee),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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

export const updateEmployee = [
  validate(schema.updateEmployee),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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
    try {
      res.json({
        data: await req.order.addEmployee(req.params.employee, {
          through: req.body.values
        }),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeEmployee = [
  validate(schema.removeEmployee),
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.params.order);

      if (req.order) {
        next();
      } else {
        throw new NotFoundError('Order not found.');
      }
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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
    try {
      res.json({
        data: await req.order.removeEmployee(req.params.employee),
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
];
