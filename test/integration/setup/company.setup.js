import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Company } = db.sequelize.models;

scenario.get_companies = {
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
      description: 'querystring is: ?search[code]=CMP',
      input: () => ({ search: { code: 'CMP' } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name][like]=%ware%',
      input: () => ({ search: { name: { like: '%ware%'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[code][like]=%CMP%',
      input: () => ({ search: { code: { like: '%CMP%'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[name][eq]=Hardware',
      input: () => ({ search: { name: { eq: 'Hardware'} } })
    },
    {
      id: uuid(),
      description: 'querystring is: ?search[code][eq]=CMP',
      input: () => ({ search: { code: { eq: 'CMP'} } })
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
        jest.spyOn(Company, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(Company, 'findAll').mockImplementation(options => {
          // search:
          const { search } = input();

          if (is.object(search) && is.empty(search)) {
            return Promise.resolve(setup.instance.companies);
          }

          if (is.undefined(search)) {
            return Promise.resolve(setup.instance.companies);
          }

          if (search.name === 'war') {
            return Promise.resolve([]);
          }

          if (search.name === 'Hardware') {
            return Promise.resolve([setup.instance.companies[0]]);
          }

          if (search.code === 'CMP') {
            return Promise.resolve([]);
          }

          if (is.object(search.name)) {
            if (search.name.like === '%war%') {
              return Promise.resolve([setup.instance.companies[0]]);
            }
            if (search.name.eq === 'Hardware') {
              return Promise.resolve([setup.instance.companies[0]]);
            }
          }

          if (is.object(search.code)) {
            if (search.code.like === '%CMP%') {
              return Promise.resolve(setup.instance.companies);
            }
            if (search.code.eq === 'CMP') {
              return Promise.resolve([]);
            }
          }

          // TODO: add querystring for "fields".

          return Promise.resolve([]);
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Company, 'findAll').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  }
};

scenario.create_companies = {
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
        jest.spyOn(Company, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      } else {
        jest.spyOn(db.sequelize, 'transaction').mockResolvedValue({
          commit: jest.fn().mockResolvedValue()
        });
        jest.spyOn(Company, 'createMany').mockImplementation((values, options) => {
          if (Array.isArray(values)) {
            let result = values.reduce((initial, values, index) => {
              initial.push(Company.build({
                code: 'CMP0083748',
                ...values
              }, options));
              return initial;
            }, []);
            return Promise.resolve(result);
          } else {
            return Promise.resolve(Company.build({
              code: 'CMP0083748',
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
        jest.spyOn(Company, 'createMany').mockRejectedValue(new Error(
          'Mock Error'
        ));
      }
    }
  },
};

scenario.get_company = {
  pass: [
    {
      id: uuid(),
      description: 'company is found',
      input: () => ({ company_id: setup.instance.companies[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'company is not found',
      input: () => ({ company_id: setup.instance.companies[0].id })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Company, 'findByPk').mockResolvedValue(null);
      } else {
        jest.spyOn(Company, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            id,
            code: 'CMP0084789',
            name: 'fake1',
            extra: null,
            created_at: '2019-01-06T08:34:31.609Z',
            updated_at: '2019-01-06T08:34:31.625Z',
            deleted_at: null
          })
        });
      }
    } else {
      if (fail) {
        jest.spyOn(Company, 'findByPk').mockResolvedValue(null);
      }
    }
  }
};

scenario.update_company = {
  pass: [
    {
      id: uuid(),
      description: 'company was updated',
      input: () => ({
        company_id: setup.instance.companies[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'company was not updated',
      input: () => ({
        company_id: setup.instance.companies[0].id,
        values: { name: 'any name' }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Company, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Company, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            update: payload => {
              return Promise.resolve({
                id,
                code: 'CMP0083834',
                name: 'fake1',
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
        jest.spyOn(Company, 'findByPk').mockResolvedValue({
          update: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

scenario.delete_company = {
  pass: [
    {
      id: uuid(),
      description: 'company was deleted',
      input: () => ({
        company_id: setup.instance.companies[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'company could not be deleted',
      input: () => ({
        company_id: setup.instance.companies[0].id,
        query: {
          force: is_mocked ? false : true
        }
      })
    }
  ],
  mock: ({ input, fail }) => {
    if (is_mocked) {
      if (fail) {
        jest.spyOn(Company, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      } else {
        jest.spyOn(Company, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            destroy: payload => {
              if (payload.force) {
                return Promise.resolve([]);
              } else {
                return Promise.resolve(Company.build({
                  id,
                  code: 'CMP0083834',
                  name: 'fake1',
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
        jest.spyOn(Company, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
