import db from "src/db/models";
import { errors } from '@playscode/fns';
import validate from 'src/validations/Order';

const { Order } = db.sequelize.models;
const { NotFoundError } = errors;

export const getOrders = [
  validate.getOrders,
  async function handler(req, res, next) {
    try {
      res.json({
        data: await Order.findAll(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const createOrders = [
  validate.createOrders,
  async function handler(req, res, next) {
    try {
      res.status(201).json({
        data: await Order.createMany(req.values.body),
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
      req.order = await Order.findByPk(req.values.params.order);

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

export const updateOrder = [
  validate.updateOrder,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.update(req.values.body),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const deleteOrder = [
  validate.deleteOrder,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.destroy(req.values.query),
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.getItems(req.values.query),
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.addItems(req.values.body.items),
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
        data: await req.order.addItem(req.values.params.item, {
          through: req.values.body.values
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.item = await req.order.getItems({
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
        data: await req.order.removeItem(req.values.params.item),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const getDepartments = [
  validate.getDepartments,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.getDepartments(req.values.query),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const setDepartments = [
  validate.setDepartments,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.addDepartments(req.values.body.departments),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getDepartment = [
  validate.getDepartment,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.values.params.department },
        plain: true
      });

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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.values.params.department },
        plain: true
      });

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
        data: await req.order.addDepartment(req.values.params.department, {
          through: req.values.body
        }),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeDepartment = [
  validate.removeDepartment,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.department = await req.order.getDepartments({
        where: { id: req.values.params.department },
        plain: true
      });

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
        data: await req.order.removeDepartment(req.values.params.department),
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.getEmployees(req.values.query),
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
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function handler(req, res, next) {
    try {
      res.json({
        data: await req.order.addEmployees(req.values.body.employees),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
]

export const getEmployee = [
  validate.getEmployee,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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

export const updateEmployee = [
  validate.updateEmployee,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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
    try {
      res.json({
        data: await req.order.addEmployee(req.values.params.employee, {
          through: req.values.body
        }),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];

export const removeEmployee = [
  validate.removeEmployee,
  async function params(req, res, next) {
    try {
      req.order = await Order.findByPk(req.values.params.order);

      if (!req.order) {
        throw new NotFoundError('Order not found.');
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  async function params(req, res, next) {
    try {
      req.employee = await req.order.getEmployees({
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
    try {
      res.json({
        data: await req.order.removeEmployee(req.values.params.employee),
        error: false
      });
    } catch (error) {
      next(error);
    }
  }
];
