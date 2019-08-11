const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/orders/orders-repository', () => database => actions);
}

function compare(name) {
  return function(a, b) {
    if (a[name].toLowerCase() < b[name].toLowerCase())
      return -1;
    if (a[name].toLowerCase() > b[name].toLowerCase())
      return 1;
    return 0;
  }
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  ordersAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findAll: options => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.orders;
        }

        if (_id === 2) {
          return setup.instance.orders.filter(
            order => order.quote_id === setup.instance.quotes[0].id
          );
        }

        if (_id === 3) {
          return setup.instance.orders.filter(
            order => order.code === setup.instance.orders[0].code
          );
        }

        if (_id === 4) {
          return setup.instance.orders.filter(
            order => order.type === 'work'
          );
        }

        if (_id === 5) {
          return setup.instance.orders.filter(
            order => order.type === 'installation'
          );
        }

        if (_id === 6) {
          return setup.instance.orders.filter(
            order => order.status === 'done'
          );
        }

        if (_id === 7) {
          return setup.instance.orders.slice(0, 1);
        }

        if (_id === 8) {
          return setup.instance.orders.slice(0, 2);
        }

        if (_id === 9 || _id === 10) {
          return setup.instance.orders.slice(0).map(order => {
            return {
              code: order.code,
              type: order.type,
              status: order.status
            };
          });
        }

        if (_id === 11) {
          return setup.instance.orders.slice(0);
        }

        if (_id === 12) {
          return setup.instance.orders.slice(0).map((order, index) => {
            return {
              ...order.dataValues,
              quote: index === 3 ? null : {}
            }
          });
        }

        if (_id === 13) {
          return setup.instance.orders.slice(0).map((order, index) => {
            return {
              ...order.dataValues,
              quote: index === 3 ? null : {},
              departments: []
            }
          });
        }

        if (_id === 14) {
          return setup.instance.orders.slice(0).map((order, index) => {
            return {
              ...order.dataValues,
              quote: index === 3 ? null : {},
              departments: [],
              items: [],
              employees: []
            }
          });
        }

        if (_id === 15 || _id === 16) {
          return setup.instance.orders.slice(0);
        }

        if (_id === 17 || _id === 18) {
          return setup.instance.orders
            .slice(0)
            .map(order => order.dataValues)
            .sort(compare('status'))
            .reverse();
        }

        if (_id === 19) {
          return setup.instance.orders
            .slice(0)
            .sort(compare('status'))
            .map(order => order.dataValues);
        }

        return [];
      }
    }));
  },
  orderIsCreated: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      create: data => setup.models.Order.build({
        ...data,
        deleted_at: null,
        created_by: null,
        updated_by: null,
        deleted_by: null
      })
    }));
  },
  orderIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      }
    }));
  },
  orderIsUpdated: ({ setup }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: async ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      update: async ({ order_id, data }) => {
        let order = setup.instance.orders.find(order => order.id === order_id);
        return {
          ...order.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  orderIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        if (cycle._id === 1) {
          return setup.instance.orders.find(
            order => order.id === order_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ order_id, options }) => {
        let order = setup.instance.orders.find(order => order.id === order_id);
        let now = new Date().toISOString();
        order.updated_at = now;
        order.deleted_at = now;
        return order;
      }
    }));
  },
  // -------------------------------------------------------
  itemsAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getItems: async ({ order, options }) => {
        let { _id } = cycle;
        let _order = setup.instance.orders[0];
        let items = await _order.getItems({});

        if ([1].includes(_id)) {
          return items;
        }
        if ([2].includes(_id)) {
          return items.filter(
            item => item.category_id === options.category_id
          );
        }
        if ([3].includes(_id)) {
          return items.filter(
            item => item.name === options.name
          );
        }
        if ([4].includes(_id)) {
          return items.slice(0, 1);
        }
        if ([5].includes(_id)) {
          return items.slice(1, 2);
        }
        if ([6].includes(_id)) {
          return items.slice(0).sort(compare('name'));
        }
        if ([7].includes(_id)) {
          return items.slice(0).sort(compare('name')).reverse();
        }
        return [];
      }
    }))
  },
  itemsAreAdded: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      addItems: ({ order_id, items }) => {
        return items.map(item_id => {
          return {
            order_id,
            item_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  itemIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getItem: ({ order, item_id, options }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let OrderItem = setup.data.order_item.find(
          oi => oi.order_id === order.id && oi.item_id === item_id
        );
        return { ...item, OrderItem };
      }
    }))
  },
  itemIsUpdated: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getItem: ({ order, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let OrderItem = setup.data.order_item.find(
          oi => oi.order_id === order.id && oi.item_id === item_id
        );
        return { ...item, OrderItem };
      },
      updateItem: ({ order_id, item_id, data, options }) => {
        return {
          order_id: order_id,
          item_id: item_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  itemIsRemoved: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        if (cycle._id === 1) {
          return setup.instance.orders.find(
            order => order.id === order_id
          );
        } else {
          return null;
        }
      },
      getItem: ({ order, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let OrderItem = setup.data.order_item.find(
          oi => oi.order_id === order.id && oi.item_id === item_id
        );
        return { ...item, OrderItem };
      },
      removeItem: ({ order_id, item_id, options }) => {
        return {
          order_id: order_id,
          item_id: item_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  },
  // -------------------------------------------------------
  departmentsAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getDepartments: async ({ order, options }) => {
        let { _id } = cycle;
        let _order = setup.instance.orders[2];
        let departments = await _order.getDepartments({});

        if ([1].includes(_id)) {
          return departments;
        }

        if ([2].includes(_id)) {
          return departments.filter(
            department => department.name === 'Printing'
          );
        }

        if ([3].includes(_id)) {
          return departments.filter(
            department => department.name.includes('ales')
          );
        }

        if ([4].includes(_id)) {
          return departments.slice(0, 2);
        }

        if ([5].includes(_id)) {
          return departments.slice(1, 2);
        }

        if ([6,7].includes(_id)) {
          return departments.slice(0, 1).map(department => {
            return {
              id: department.id,
              code: department.code,
              name: department.name,
              OrderDepartment: []
            }
          });
        }

        if ([8].includes(_id)) {
          return departments.slice(0, 1).map(department => {
            return { ...department, employees: [] };
          });
        }

        if ([9].includes(_id)) {
          return departments.slice(0, 1).map(department => {
            return {
              ...department,
              employees: [],
              orders: []
            };
          });
        }

        return [];
      }
    }))
  },
  departmentsAreAdded: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      addDepartments: ({ order_id, departments }) => {
        return departments.map(department_id => {
          return {
            order_id,
            department_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  departmentIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getDepartment: ({ order, department_id, options }) => {
        let department = setup.data.department.find(
          department => department.id === department_id
        );
        let OrderDepartment = setup.data.order_department.find(
          oi => oi.order_id === order.id
          && oi.department_id === department_id
        );
        return { ...department, OrderDepartment };
      }
    }))
  },
  departmentIsUpdated: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getDepartment: ({ order, department_id }) => {
        let department = setup.data.department.find(
          department => department.id === department_id
        );
        let OrderDepartment = setup.data.order_department.find(
          oi => oi.order_id === order.id
          && oi.department_id === department_id
        );
        return { ...department, OrderDepartment };
      },
      updateDepartment: ({ order_id, department_id, data, options }) => {
        return {
          order_id: order_id,
          department_id: department_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  departmentIsRemoved: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        if (cycle._id === 1) {
          return setup.instance.orders.find(
            order => order.id === order_id
          );
        } else {
          return null;
        }
      },
      getDepartment: ({ order, department_id }) => {
        let department = setup.data.department.find(
          department => department.id === department_id
        );
        let OrderDepartment = setup.data.order_department.find(
          oi => oi.order_id === order.id
          && oi.department_id === department_id
        );
        return { ...department, OrderDepartment };
      },
      removeDepartment: ({ order_id, department_id, options }) => {
        return {
          order_id: order_id,
          department_id: department_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  },
  // ------------------------------------------------------
  employeesAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getEmployees: async ({ order, options }) => {
        let { _id } = cycle;
        let _order = setup.instance.orders[0];
        let employees = await _order.getEmployees({});

        if ([1].includes(_id)) {
          return employees;
        }
        if ([2].includes(_id)) {
          return employees.filter(
            employee => employee.firstname === 'Luis'
          );
        }
        if ([3].includes(_id)) {
          return employees.filter(
            employee => employee.firstname.includes('uis')
          );
        }
        if ([4].includes(_id)) {
          return employees.slice(0, 2);
        }
        if ([5].includes(_id)) {
          return employees.slice(0, 1);
        }
        if ([6,7].includes(_id)) {
          return employees.slice(0, 1).map(employee => {
            return {
              id: employee.id,
              code: employee.code,
              firstname: employee.firstname,
              OrderEmployee: []
            }
          });
        }
        if ([8].includes(_id)) {
          return employees.slice(0, 1).map(employee => {
            return { ...employee, supervisors: [] };
          });
        }
        if ([9].includes(_id)) {
          return employees.slice(0, 1).map(employee => {
            return { ...employee, supervisors: [], orders: [] };
          });
        }

        return [];
      }
    }))
  },
  employeesAreAdded: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      addEmployees: ({ order_id, employees }) => {
        return employees.map(employee_id => {
          return {
            order_id,
            employee_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  employeeIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getEmployee: ({ order, employee_id, options }) => {
        let employee = setup.data.employee.find(
          employee => employee.id === employee_id
        );
        let OrderEmployee = setup.data.order_employee.find(
          oi => oi.order_id === order.id
          && oi.employee_id === employee_id
        );
        return { ...employee, OrderEmployee };
      }
    }))
  },
  employeeIsUpdated: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        return setup.instance.orders.find(
          order => order.id === order_id
        );
      },
      getEmployee: ({ order, employee_id }) => {
        let employee = setup.data.employee.find(
          employee => employee.id === employee_id
        );
        let OrderEmployee = setup.data.order_employee.find(
          oi => oi.order_id === order.id
          && oi.employee_id === employee_id
        );
        return { ...employee, OrderEmployee };
      },
      updateEmployee: ({ order_id, employee_id, data, options }) => {
        return {
          order_id: order_id,
          employee_id: employee_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  employeeIsRemoved: ({ setup, cycle }) => {
    jest.doMock('src/core/orders/orders-repository', () => db => ({
      findByPk: ({ order_id, options }) => {
        if (cycle._id === 1) {
          return setup.instance.orders.find(
            order => order.id === order_id
          );
        } else {
          return null;
        }
      },
      getEmployee: ({ order, employee_id }) => {
        let employee = setup.data.employee.find(
          employee => employee.id === employee_id
        );
        let OrderEmployee = setup.data.order_employee.find(
          oi => oi.order_id === order.id
          && oi.employee_id === employee_id
        );
        return { ...employee, OrderEmployee };
      },
      removeEmployee: ({ order_id, employee_id, options }) => {
        return {
          order_id: order_id,
          employee_id: employee_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  },
};
