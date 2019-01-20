import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Item } = db.sequelize.models;

scenario.get_items = {
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
        jest.spyOn(Item, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(Item, 'findAll').mockImplementation(options => {
          // search:
          const { search } = input();

          if (is.object(search) && is.empty(search)) {
            return Promise.resolve(setup.instance.items);
          }

          if (is.undefined(search)) {
            return Promise.resolve(setup.instance.items);
          }

          if (search.name === 'war') {
            return Promise.resolve([]);
          }

          if (search.name === 'Hardware') {
            return Promise.resolve([setup.instance.items[0]]);
          }

          if (search.code === 'SPL') {
            return Promise.resolve([]);
          }

          if (is.object(search.name)) {
            if (search.name.like === '%war%') {
              return Promise.resolve([setup.instance.items[0]]);
            }
            if (search.name.eq === 'Hardware') {
              return Promise.resolve([setup.instance.items[0]]);
            }
          }

          if (is.object(search.code)) {
            if (search.code.like === '%SPL%') {
              return Promise.resolve(setup.instance.items);
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
        jest.spyOn(Item, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  }
};

scenario.create_items = {
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
        jest.spyOn(Item, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          commit: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Item, 'createMany').mockImplementation((values, options) => {
          if (Array.isArray(values)) {
            let result = values.reduce((initial, values, index) => {
              initial.push(Item.build({
                code: 'SPL0083748',
                ...values
              }, options));
              return initial;
            }, []);
            return Promise.resolve(result);
          } else {
            return Promise.resolve(Item.build({
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
        jest.spyOn(Item, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  },
};

scenario.get_item = {
  pass: [
    {
      id: uuid(),
      description: 'item is found',
      input: () => ({ item_id: setup.instance.items[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'item is not found',
      input: () => ({ item_id: setup.instance.items[0].id })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
      } else {
        jest.spyOn(Item, 'findByPk').mockImplementation(id => {
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
        jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
      }
    }
  }
};

scenario.update_item = {
  pass: [
    {
      id: uuid(),
      description: 'item was updated',
      input: () => ({
        item_id: setup.instance.items[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'item was not updated',
      input: () => ({
        item_id: setup.instance.items[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockImplementation(id => {
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
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.delete_item = {
  pass: [
    {
      id: uuid(),
      description: 'item was deleted',
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'item could not be deleted',
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            destroy: payload => {
              if (payload.force) {
                return Promise.resolve([]);
              } else {
                return Promise.resolve(Item.build({
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
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.get_types = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: null
      }),
    },
    {
      id: uuid(),
      description: 'querystring is sent but something is wrong in the server',
      input: () => ({
        item_id: setup.instance.items[0].id,
        query: { name: { eq: 'Hardware'} }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn().mockRejectedValue(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn().mockResolvedValue([])
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn().mockRejectedValue(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.add_types = {
  pass: [
    {
      id: uuid(),
      description: "types are added sucessfully to a item",
      input: () => ({
        item_id: setup.instance.items[0].id,
        types: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: "types are not added to a item",
      input: () => ({
        item_id: setup.instance.items[0].id,
        types: setup.instance.items.map(item => item.id)
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          addTypes: jest.fn().mockRejectedValue(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          commit: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          addTypes: jest.fn(payload => Promise.resolve(payload))
        });
      }
    } else {
      if (fail) {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          rollback: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          addTypes: jest.fn().mockRejectedValue(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.get_type = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn().mockResolvedValue(null)
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn((type, id) => Promise.resolve({ id }))
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: jest.fn().mockResolvedValue(null)
        });
      }
    }
  }
};

scenario.update_type = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          addType: (type, id) => Promise.reject(new Error('Mock error'))
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          addType: () => Promise.resolve({
            id: '419056d0-cf01-432a-9770-15bf4a201100'
          })
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          addType: (type, id) => Promise.reject(new Error('Mock error'))
        });
      }
    }
  }
};

scenario.remove_type = {
  pass: [
    {
      id: uuid(),
      description: "querystring is ...",
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'querystring is malformed',
      input: () => ({
        item_id: setup.instance.items[0].id,
        type_id: setup.instance.items[0].id
      }),
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          removeType: (type, id) => Promise.reject(new Error('Mock error'))
        });
      } else {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          removeType: () => Promise.resolve({
            id: '419056d0-cf01-432a-9770-15bf4a201100'
          })
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          findTypes: (type, id) => Promise.resolve({ id }),
          removeType: (type, id) => Promise.reject(new Error('Mock error'))
        });
      }
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
