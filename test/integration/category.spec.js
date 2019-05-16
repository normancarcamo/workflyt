import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/categories';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Category } = db.sequelize.models;

describe("Category Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get categories:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Given:
        let querystring = {};

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Given:
        let querystring = { search: {} };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: undefined`, async () => {
        // Given:
        let querystring = { search: undefined };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { name: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: { like: '%vvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { name: { like: '%vvv%' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - query validation fail`, async () => {
        // Given:
        let querystring = { search: null };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Action throw error`, async () => {
        // Mock:
        jest.spyOn(Category, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { name: { eq: 'Category A' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create categories:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'create').mockResolvedValue(setup.instance.categories[0]);
        }

        // Given:
        let values = { name: 'demo' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'create').mockResolvedValue(Category.build({
            ...setup.instance.categories[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          name: 'demo',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        expect(res.body.data.updated_by).toEqual(setup.instance.users[0].id);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value "name" is not valid`, async () => {
        // Given:
        let values = { name: '' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Category, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Category A' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get category:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - category is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(setup.instance.categories[0]);
        }

        // Given:
        let category_id = setup.instance.categories[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${category_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - category id param is malformed`, async () => {
        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${category_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${category_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update category:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Category.build({
              ...setup.instance.categories[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue(null);

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete category:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - category is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let category = setup.instance.categories[0];
              category.deleted_at = new Date().toISOString();
              return category;
            }
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let category = setup.instance.categories[0];
              category.deleted_at = new Date().toISOString();
              return category;
            }
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let category = setup.instance.categories[0];
              category.deleted_at = new Date().toISOString();
              return category;
            }
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}`;
        let options = { force: false }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - category id param is malformed`, async () => {
        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${category_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${category_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  describe("get items:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = {}

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: {} }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: undefined }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: undefined }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: 'ccccc' } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: { name: 'ccccc' } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: { like: '%vv%' } } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: { name: { like: '%vv%' } } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - query search validation fail`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: null };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: { name: { eq: 'model' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: { name: { eq: 'model' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items were trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { search: { name: { eq: 'model' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set items:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - items are set to a category`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            addItems: async (payload, options) => payload
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = setup.instance.items.map(i => i.id);

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - category id param is malformed`, async () => {
        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = setup.instance.items.map(item => item.id);

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items ids values are malformed`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ];

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = setup.instance.items.map(item => item.id);

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = setup.instance.items.map(item => item.id);

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items were trying to be set`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          addItems: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let items = setup.instance.items.map(item => item.id);

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get item:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - category is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items[0]
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - category id param is malformed`, async () => {
        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async payload => null
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("remove item:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - item is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async payload => ({
              setCategory: async () => {
                const now = new Date().toISOString();
                setup.instance.items[0].updated_at = now;
                setup.instance.items[0].deleted_at = now;
                return setup.instance.items[0];
              }
            })
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - category id param is malformed`, async () => {
        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async payload => null
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be removed`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue({
          getItems: async payload => ({
            setCategory: async (payload) => {
              throw ERROR_MOCK;
            }
          })
        });

        // Given:
        let category_id = setup.instance.categories[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
