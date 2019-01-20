import { setup, scenario } from '../setup/category.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/categories`;

describe("Category Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  describe("get categories:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_categories.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_categories.mock({ input, fail: false });

          // Given:
          let querystring = input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_categories.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_categories.mock({ input, fail: true });

          // Given:
          let querystring = input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("create categories:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_categories.pass) {
        it(description, async () => {
          // Given:
          scenario.create_categories.mock({ input, fail: false });

          // When:
          let res = await request("post", API_BASE).send(input());

          // Then:
          // console.log('===========>', res.body.error);
          expect(res.statusCode).toEqual(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.create_categories.fail) {
        it(description, async () => {
          // Given:
          scenario.create_categories.mock({ input, fail: true });

          // When:
          let res = await request("post", API_BASE).send(input());

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get category:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_category.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_category.mock({ input, fail: false });

          // Given:
          let { category_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${category_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_category.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_category.mock({ input, fail: true });

          // Given:
          let { category_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${category_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update category:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_category.pass) {
        it(description, async () => {
          // Setup:
          scenario.update_category.mock({ input, fail: false });

          // Given:
          let { category_id, values } = input();
          let endpoint = `${API_BASE}/${category_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.headers).toContainKeys(['content-type', 'content-length']);
          expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.update_category.fail) {
        it(description, async () => {
          // Setup:
          scenario.update_category.mock({ input, fail: true });

          // Given:
          let { category_id, values } = input();
          let endpoint = `${API_BASE}/${category_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("delete category:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_category.pass) {
        it(description, async () => {
          // Setup:
          scenario.delete_category.mock({ input, fail: false });

          // Given:
          let { category_id, query } = input();
          let endpoint = `${API_BASE}/${category_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          // console.log('===========>', res.body.error);
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.delete_category.fail) {
        it(description, async () => {
          // Setup:
          scenario.delete_category.mock({ input, fail: true });

          // Given:
          let { category_id, query } = input();
          let endpoint = `${API_BASE}/${category_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("add items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.add_items.pass) {
        it(description, async () => {
          // Setup:
          scenario.add_items.mock({ input, fail: false });

          // Given:
          let { category_id, items } = input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.add_items.fail) {
        it(description, async () => {
          // Setup:
          scenario.add_items.mock({ input, fail: true });

          // Given:
          let { category_id, items } = input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: false });

          // Given:
          let { category_id, query } = input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_items.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: true });

          // Given:
          let { category_id, query } = input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: false });

          // Given:
          let { category_id, item_id } = input();
          let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe.skip('should return error when:', () => {
      for (let { id, description, input } of scenario.get_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: true });

          // Given:
          let { category_id, item_id } = input();
          let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
