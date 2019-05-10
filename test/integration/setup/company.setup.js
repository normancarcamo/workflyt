import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Company } = db.sequelize.models;

scenario.get_companies = {
  pass: [
    {
      id: uuid(),
      description: 'query sent is: {}',
      input: async () => ({})
    },
    {
      id: uuid(),
      description: 'query sent is: { search: {} }',
      input: async () => ({ search: {} })
    },
    {
      id: uuid(),
      description: 'query sent is: undefined',
      input: async () => ({ search: undefined })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: 'ccccc' } }",
      input: async () => ({ search: { name: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: { like: '%vvvvv%' } } }",
      input: async () => ({ search: { name: { like: '%vvvvv%' } } })
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query validation fail',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Company search action throws error',
      input: async () => ({ search: { name: { eq: 'model' } } })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Company search action throws error') {
      return jest.spyOn(Company, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Company, 'findAll').mockResolvedValue([]);
    }
  }
};

scenario.create_companies = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({ values: [{ name: "sps" }] })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({ values: { name: "tgu" } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Array but validation fail',
      input: async () => ({ values: [ { name: "" } ] })
    },
    {
      id: uuid(),
      description: 'Object but validation fail',
      input: async () => ({ values: { name: "" } })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({ values: { name: "Company A" } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Action throw error' && is_mocked) {
      return jest.spyOn(Company, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Company, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values, index) => {
            initial.push(Company.build(values, options));
            return initial;
          }, []);
        } else {
          return Promise.resolve(Company.build(values, options));
        }
      });
    }
  },
};

scenario.get_company = {
  pass: [
    {
      id: uuid(),
      description: 'Company is found',
      input: async () => ({
        company_id: setup.instance.companies[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Company id param is malformed',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcfxx111s'
      })
    },
    {
      id: uuid(),
      description: 'Company is not found',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Company was trying to be found',
      input: async () => ({
        company_id: setup.instance.companies[0].id
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Company is not found' && is_mocked) {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Company was trying to be found') {
      return jest.spyOn(Company, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Company, 'findByPk')
        .mockResolvedValue(setup.instance.companies[0]);
    }
  }
};

scenario.update_company = {
  pass: [
    {
      id: uuid(),
      description: 'Company is updated',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        values: { name: 'Company A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Company id param is malformed',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Company A' }
      })
    },
    {
      id: uuid(),
      description: 'Company is not found',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Company A' }
      })
    },
    {
      id: uuid(),
      description: 'Company was trying to be found',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        values: { name: 'Company A' }
      })
    },
    {
      id: uuid(),
      description: 'Company was trying to be updated',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        values: { name: 'Company A' }
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Company is not found' && is_mocked) {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Company was trying to be found') {
      return jest.spyOn(Company, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'Company was trying to be updated') {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Company.build({
          ...setup.instance.companies[0].dataValues,
        ...payload,
          updated_at: new Date().toISOString()
        }, options)
      });
    }
  }
};

scenario.delete_company = {
  pass: [
    {
      id: uuid(),
      description: 'Company is deleted without options',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Company is deleted with force option a true',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        query: { force: true}
      })
    },
    {
      id: uuid(),
      description: 'Company is deleted with force option a false',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        query: { force: false }
      })
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Company id is malformed',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Company is not found',
      input: async () => ({
        company_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Company was trying to be found',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Company was trying to be removed',
      input: async () => ({
        company_id: setup.instance.companies[0].id,
        query: {}
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Company is not found' && is_mocked) {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Company was trying to be found') {
      return jest.spyOn(Company, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'Company was trying to be removed') {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Company, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          if (options.force) {
            return [];
          } else {
            const now = new Date().toISOString()
            setup.instance.companies[0].updated_at = now;
            setup.instance.companies[0].deleted_at = now;
            return setup.instance.companies[0];
          }
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
