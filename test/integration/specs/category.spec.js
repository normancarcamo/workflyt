import { setup, scenario } from '../setup/category.setup';
import { request } from 'test/utils';

const API_BASE = '/api/v1/categories';

describe("Category Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get categories:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_categories.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_categories.mock({ input, fail: false, stage: description });

          // Given:
          let querystring = await input();

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
          await scenario.get_categories.mock({ input, fail: true, stage: description });

          // Given:
          let querystring = await input();

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
          await scenario.create_categories.mock({ input, fail: false, stage: description });

          // When:
          let res = await request("post", API_BASE).send(await input());

          // Then:
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
          await scenario.create_categories.mock({ input, fail: true, stage: description });

          // When:
          let res = await request("post", API_BASE).send(await input());

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
          await scenario.get_category.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id } = await input();

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
          await scenario.get_category.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id } = await input();

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
          await scenario.update_category.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, values } = await input();
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
          await scenario.update_category.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, values } = await input();
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
          await scenario.delete_category.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, query } = await input();
          let endpoint = `${API_BASE}/${category_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
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
          await scenario.delete_category.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, query } = await input();
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

  describe("get items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_items.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, query } = await input();
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
          await scenario.get_items.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, query } = await input();
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

  describe("set items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_items.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_items.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, items } = await input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ items });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_items.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_items.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, items } = await input();
          let endpoint = `${API_BASE}/${category_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ items });

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
          await scenario.get_item.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, item_id } = await input()
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
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_item.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_item.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, item_id } = await input();
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

  describe("remove item:", () => {
    describe('should return success when:', () => {
      for (let { id, description, input } of scenario.remove_item.pass) {
        it(description, async () => {
          // Setup:
          await scenario.remove_item.mock({ input, fail: false, stage: description });

          // Given:
          let { category_id, item_id } = await input();
          let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.remove_item.fail) {
        it(description, async () => {
          // Setup:
          await scenario.remove_item.mock({ input, fail: true, stage: description });

          // Given:
          let { category_id, item_id } = await input();
          let endpoint = `${API_BASE}/${category_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });
});
