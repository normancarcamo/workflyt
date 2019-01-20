import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Warehouse } = db.sequelize.models;

scenario.get_warehouses = {
  pass: [
    {
      id: uuid(),
      description: 'querystring is: empty',
      input: () => ({ search: {} })
    },
    {
      id: uuid(),
      description: 'querystring is: undefined',
      input: () => ({ search: undefined })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name]=war',
      input: () => ({ search: { name: 'war' } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name]=Hardware',
      input: () => ({ search: { name: 'Hardware' } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[code]=SPL',
      input: () => ({ search: { code: 'SPL' } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name][like]=%ware%',
      input: () => ({ search: { name: { like: '%ware%'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[code][like]=%SPL%',
      input: () => ({ search: { code: { like: '%SPL%'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name][eq]=Hardware',
      input: () => ({ search: { name: { eq: 'Hardware'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[code][eq]=SPL',
      input: () => ({ search: { code: { eq: 'SPL'} } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is: ?search=null',
      input: () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'querystring is sent but something is wrong in the server',
      input: () => ({ search: { name: { eq: 'Hardware'} } })
    },
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(Warehouse, 'findAll').mockImplementation(options => {
          // search:
          const { search } = input();

          if (is.object(search) && is.empty(search)) {
            return Promise.resolve(setup.instance.warehouses);
          }

          if (is.undefined(search)) {
            return Promise.resolve(setup.instance.warehouses);
          }

          if (search.name === 'war') {
            return Promise.resolve([]);
          }

          if (search.name === 'Hardware') {
            return Promise.resolve([setup.instance.warehouses[0]]);
          }

          if (search.code === 'SPL') {
            return Promise.resolve([]);
          }

          if (is.object(search.name)) {
            if (search.name.like === '%war%') {
              return Promise.resolve([setup.instance.warehouses[0]]);
            }
            if (search.name.eq === 'Hardware') {
              return Promise.resolve([setup.instance.warehouses[0]]);
            }
          }

          if (is.object(search.code)) {
            if (search.code.like === '%SPL%') {
              return Promise.resolve(setup.instance.warehouses);
            }
            if (search.code.eq === 'SPL') {
              return Promise.resolve([]);
            }
          }

          // TODO: add querystring for "fields".

          return Promise.resolve([]);
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  }
};

scenario.create_warehouses = {
  pass: [
    {
      id: uuid(),
      description: 'values are sent as array',
      input: () => ({
        values: [ { name: "sps" } ]
      })
    },
    {
      id: uuid(),
      description: 'values are sent as object',
      input: () => ({
        values: { name: "tgu" }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'values are sent as an array but server reject',
      input: () => ({
        values: [ { name: "sps" } ]
      })
    },
    {
      id: uuid(),
      description: 'values are sent as object but server reject',
      input: () => ({
        values: { name: "tgu" }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          commit: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'createMany').mockImplementation((values, options) => {
          if (Array.isArray(values)) {
            let result = values.reduce((initial, values, index) => {
              initial.push(Warehouse.build({
                code: 'SPL0083748',
                ...values
              }, options));
              return initial;
            }, []);
            return Promise.resolve(result);
          } else {
            return Promise.resolve(Warehouse.build({
              code: 'SPL0083748',
              ...values
            }));
          }
        });
      }
    } else {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  },
};

scenario.get_warehouse = {
  pass: [
    {
      id: uuid(),
      description: 'warehouse is found',
      input: () => ({ warehouse_id: setup.instance.warehouses[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'warehouse is not found',
      input: () => ({ warehouse_id: setup.instance.warehouses[0].id })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            id,
            code: 'SPL0084789',
            name: 'SAT',
            extra: null,
            created_at: '2019-01-06T08:34:31.609Z',
            updated_at: '2019-01-06T08:34:31.625Z',
            deleted_at: null
          })
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
      }
    }
  }
};

scenario.update_warehouse = {
  pass: [
    {
      id: uuid(),
      description: 'warehouse was updated',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'warehouse was not updated',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            update: payload => {
              return Promise.resolve({
                id,
                code: 'SPL0083834',
                name: 'SAT',
                extra: null,
                created_at: '2019-01-06T06:33:36.582Z',
                updated_at: '2019-01-06T06:33:36.709Z',
                deleted_at: null,
                ...payload
              })
            }
          })
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.delete_warehouse = {
  pass: [
    {
      id: uuid(),
      description: 'warehouse was deleted',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'warehouse could not be deleted',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            destroy: payload => {
              if (payload.force) {
                return Promise.resolve([]);
              } else {
                return Promise.resolve(Warehouse.build({
                  id,
                  code: 'SPL0083834',
                  name: 'SAT',
                  extra: null,
                  created_at: '2019-01-06T06:33:36.582Z',
                  updated_at: '2019-01-06T06:33:36.709Z',
                  deleted_at: new Date().toISOString()
                }))
              }
            }
          });
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.add_items = {
  pass: [
    {
      id: uuid(),
      description: "items are added sucessfully to a warehouse",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: "items are not added to a warehouse",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          addItems: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          commit: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          addItems: payload => Promise.resolve(payload)
        });
      }
    } else {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          addItems: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.get_items = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: null
      }),
    },
    {
      id: uuid(),
      description: 'querystring is sent but something is wrong in the server',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        query: { name: { eq: 'Hardware'} }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items)
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.get_item = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(null)
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0])
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(null)
        });
      }
    }
  }
};

scenario.update_item = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          addItem: () => Promise.reject(new Error('Mock error'))
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          addItem: payload => Promise.resolve(setup.instance.items[0]),
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          addItem: () => Promise.reject(new Error('Mock error'))
        });
      }
    }
  }
};

scenario.remove_item = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        warehouse_id: setup.instance.warehouses[0].id,
        item_id: setup.instance.items[0].id
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          removeItem: () => Promise.reject(new Error('Mock error'))
        });
      } else {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          removeItem: payload => Promise.resolve(setup.instance.items[0])
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: payload => Promise.resolve(setup.instance.items[0]),
          removeItem: () => Promise.reject(new Error('Mock error'))
        });
      }
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
