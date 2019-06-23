import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/categories';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Category } = db.sequelize.models;

describe.skip("Category Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get categories:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Given:
        let querystring = {};

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { name: 'ccccc' }`, async () => {
        // Given:
        let querystring = { name: 'ccccc' };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query uses like`, async () => {
        // Given:
        let querystring = { name: { like: 'nit' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query uses include`, async () => {
        // Given:
        let querystring = { name: 'Plastic', include: 'items' };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query uses include as array type`, async () => {
        // Given:
        let querystring = {
          name: 'Plastic',
          include: ['items']
        };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query uses attributes`, async () => {
        // Given:
        let querystring = {
          name: 'Plastic',
          include: 'items',
          attributes: 'id,code,name'
        };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query uses attributes as array type`, async () => {
        // Given:
        let querystring = {
          name: 'Plastic',
          include: 'items',
          attributes: ['id', 'code', 'name']
        };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - querystring validation fails`, async () => {
        // Given:
        let querystring = { name: "abcdefghijklmnopqrstuvwxyz1234567890" };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Action throw error`, async () => {
        // Mock:
        jest.spyOn(Category, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { name: 'Category A' };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("create categories:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'create').mockResolvedValue(
            setup.instance.categories[0]
          );
        }

        // Given:
        let values = { name: 'demo' };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'create').mockResolvedValue(Category.build({
            ...setup.instance.categories[0].dataValues,
            created_by: setup.instance.users[0].id
          }));
        }

        // Given:
        let values = {
          name: 'demo',
          created_by: setup.instance.users[0].id
        };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - value "name" is not valid`, async () => {
        // Given:
        let values = { name: '' };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Category, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Category A' };

        // When:
        let res = await request("post", API_BASE).send(values );

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("get category:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - category is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(
            setup.instance.categories[0]
          );
        }

        // Given:
        let category_id = setup.instance.categories[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${category_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - category is not found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockResolvedValue(null);

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let values = { name: 'Category A' };
        let endpoint = `${API_BASE}/${category_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as true`, async () => {
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as false`, async () => {
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { name: 'ccccc' }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { name: 'ccccc' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { name: { like: 'vv' } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items
          });
        }

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { name: { like: 'vv' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - query search validation fail`, async () => {
        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { mmmmm: 'mmmmm' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - category was not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { name: 'model' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - category was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Category, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let category_id = setup.instance.categories[0].id;
        let endpoint = `${API_BASE}/${category_id}/items`;
        let options = { name: 'model' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        let options = { name: 'model' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
