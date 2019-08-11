const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/categories';
const mocks = require('./categories-mocks');

describe('Category Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/categories/categories-repository');
  });

  // Categories ---------------------------------------------------------------

  describe('get categories:', () => {
    it('should return status 403 when access control is denied', async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdkdmdkmdkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get categories' ];
      let options = { name: 'abcdefghijklmnopqrstuvwxyz1234567890' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 400, 'C02H01-01');
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get categories' ];
      let options = { name: 'steel' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H01-02');
    });
    it(`should return status 200 when categories are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.categoriesAreFiltered({ cycle, setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get categories' ];
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'Art' } ],
        [ 3, { name: { like: '%sign%' } } ],
        [ 4, { name: 'Art', include: 'items' } ],
        [ 5, { name: 'Design', include: [ 'items' ] } ],
        [ 6, { name: 'Art', include: [ 'parent' ] } ],
        [ 7, { name: 'Design', include: [ 'parent' ] } ],
        [ 8, { name: { like: '%sign%' }, attributes: 'id,code,name' } ],
        [ 8, { name: 'Design', attributes: 'id,code,name' } ],
        [ 9, { name: 'Design', attributes: [ 'id', 'code', 'name' ] } ],
        [ 10, { limit: 2 } ],
        [ 11, { offset: 1 } ],
        [ 12, { offset: 1, limit: 5 } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);

        if (id === 2) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Art');
        }

        if (id === 3) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Design');
        }

        if (id === 4) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Art');
          expect(res.body.data[0].items).toBeArray().toBeEmpty();
        }

        if (id === 5) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Design');
          expect(res.body.data[0].items).toBeArray().not.toBeEmpty();
        }

        if (id === 6) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Art');
          expect(res.body.data[0]).toHaveProperty('parent', null);
        }

        if (id === 7) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Design');
          expect(res.body.data[0].parent).toBeObject().not.toBeEmpty();
        }

        if (id === 8 || id === 9) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          let category = setup.instance.categories[1];
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('id', category.id);
          expect(res.body.data[0]).toHaveProperty('code', category.code);
          expect(res.body.data[0]).toHaveProperty('name', category.name);
        }

        if (id === 10) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(2);
        }

        if (id === 11 || id === 12) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Design');
        }
      }
    });
  });

  describe('create categories:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdkdmdkmdkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'naaaa' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create categories' ];
      let payload = [
        [ 1, { name : '' } ],
        [ 2, { id : 'dsnksdjnjk' } ],
        [ 3, {} ],
        [ 4, { id: 233, name: '' } ]
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.createRepeatedError({ cycle, setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create categories' ];
      let payload = [
        [ 1, { name: 'demo' } ],
        [ 2, { name: 'demo' } ],
      ];

      for (let [ id, data ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        if (id === 1) {
          setup.assertOk(expect, res, 201);
        } else if (id === 2) {
          setup.assertError(expect, res, 500, 'C02H02-02');
        }
      }
    });
    it(`should return status 200 when category is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.categoryIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create categories' ];
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 201);
      expect(res.body.data).toBeObject();
      expect(res.body.data).toContainAnyKeys([
        'id', 'code', 'name', 'parent_id', 'extra',
        'created_at', 'updated_at', 'deleted_at',
        'created_by', 'updated_by', 'deleted_by'
      ]);
      expect(res.body.data.name).toBe('demo');
    });
  });

  describe('get category:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let category_id = setup.instance.categories[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdkdnkdndkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get category' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd',
          {}
        ],
        [
          2,
          setup.instance.categories[0].id,
          { attributes: 'sssmsm' }
        ]
      ];

      for (let [ id, category_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H03-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get category' ];
      let category_id = setup.instance.categories[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H03-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get category' ];
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H03-03');
    });
    it(`should return status 200 when category is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.categoryIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get category' ];
      let category_id = setup.instance.categories[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject();
      expect(res.body.data.id).toBe(category_id);
      expect(res.body.data.name).toBeString();
      expect(res.body.data.name).not.toBeEmpty();
      expect(res.body.data.deleted_at).toBe(null);
    });
  });

  describe('update category:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdnkdn' ] ]
      ];
      let app = require('src/app.js');

      for (let [ id, permissions] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.categories[0].id}`)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let permissions = [ 'update category' ];
      let payload = [
        { id: 234 },
        { name: '' },
      ];
      let app = require('src/app.js');

      for (let data of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.categories[0].id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H04-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update category' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.categories[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H04-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update category' ];
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${category_id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H04-03');
    });
    it(`should return status 500 when category tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update category' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.categories[0].id}`)
        .send({ name: 'name' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H04-04');
    });
    it(`should return status 200 when category is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.categoryIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update category' ];
      let oldName = setup.instance.categories[0].name;
      let values = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.categories[0].id}`)
        .send(values)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete category:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let category_id = setup.instance.categories[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmkdkdm' ] ]
      ];
      let app = require('src/app.js');

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${category_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let permissions = [ 'delete category' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.categories[0].id, { force:'nanana' } ]
      ];
      let app = require('src/app.js');

      for (let [ id, category_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${category_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H05-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete category' ];
      let category_id = setup.instance.categories[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H05-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete category' ];
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H05-03');
    });
    it(`should return status 500 when category tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete category' ];
      let category_id = setup.instance.categories[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H05-04');
    });
    it(`should return status 200 when category is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };
      if (setup.is_mocked) {
        mocks.categoryIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete category' ];
      let category_id = setup.instance.categories[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true, paranoid: false } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${category_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        if (id === 1) {
          setup.assertOk(expect, res, 200);
        } else {
          setup.assertError(expect, res, 404);
        }
      }
    });
  });

  // Items --------------------------------------------------------------------

  describe('get items:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let category_id = setup.instance.categories[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdkdn' ] ],
      ];
      let app = require('src/app.js');

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}/items`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let permissions = [ 'get items from category' ];
      let category_id = setup.instance.categories[0].id;
      let payload = [
        [ 1, { mmmmm: 'mmmmm' } ]
      ];
      let app = require('src/app.js');

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H06-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from category' ];
      let category_id = setup.instance.categories[0].id;
      let options = { name: 'model' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H06-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from category' ];
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { name: 'model' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H06-03');
    });
    it(`should return status 500 when items tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from category' ];
      let category_id = setup.instance.categories[0].id;
      let options = { name: 'model' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H06-04');
    });
    it(`should return status 200 when items were filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.itemsAreFiltered({ cycle, setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from category' ];
      let payload = [
        [ 1, { limit: 2 } ], // 1. Logo Design and 2. Sign for traffic 4x24
        [ 2, { offset: 0, limit: 1 } ],
        [ 3, {} ],
        [ 4, { price: { gt: 600 } } ],
        [ 5, { price: { between: [ 500, 501.2 ] } } ],
        [ 6, { sort_by: 'name', order_by: 'desc' } ],
        [ 7, { created_at: { between: [ '2019-05-20', '2019-07-28' ] } } ],
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.categories[1].id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if (id === 1) {
          expect(res.body.data).not.toBeEmpty().toHaveLength(2);
        }

        if (id === 2) {
          expect(res.body.data).not.toBeEmpty().toHaveLength(1);
        }
      }
    });
  });

  describe('add items:', () => {
    it(`should return stastus 403 when access control is denied`, async () => {
      // Arrange:
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let items = setup.instance.items.map(item => item.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'ksnsksnksn' ] ],
      ];
      let app = require('src/app.js');

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${category_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H07-00');
      }
    });
    it(`should return stastus 400 when data validation fail`, async () => {
      // Arrange:
      let permissions = [ 'add items to category' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { items: setup.instance.items.map(item => item.id) }
        ],
        [
          2,
          setup.instance.categories[0].id,
          { items: [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ] }
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          { items: [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ] }
        ]
      ];
      let app = require('src/app.js');

      for (let [ id, category_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${category_id}/items`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H07-01');
      }
    });
    it(`should return stastus 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to category' ];
      let category_id = setup.instance.categories[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${category_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H07-02');
    });
    it(`should return stastus 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to category' ];
      let category_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${category_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H07-03');
    });
    it(`should return stastus 500 when items tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to category' ];
      let category_id = setup.instance.categories[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${category_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H07-04');
    });
    it(`should return stastus 200 when items were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreAdded();
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to category' ];

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${setup.instance.categories[0].id}/items`)
        .send({ items: setup.instance.items.slice(0, 2).map(item => item.id) })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'sksksmksmsk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.items[0].id,
          {}
        ],
        [
          2,
          setup.instance.categories[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllla',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          4,
          setup.instance.categories[0].id,
          setup.instance.items[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, category_id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${category_id}/items/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H08-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H08-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let category_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H08-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H08-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: false, getItem: true });


      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H08-05');
    });
    it(`should return status 200 when item is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from category' ];
      let category = setup.instance.categories[1];
      let item = setup.instance.items.find(
        item => item.category_id === category.id
      );

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${category.id}/items/${item.id}`)
        .query({ attributes: 'id,name' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(item.id);
    });
  });

  describe('remove item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'sksksmksm' ] ]
      ];
      let app = require('src/app.js');

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${category_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C02H09-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let permissions = [ 'remove item from category' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.items[0].id,
          {}
        ],
        [
          2,
          setup.instance.categories[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllla',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ]
      ];
      let app = require('src/app.js');

      for (let [ id, category_id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${category_id}/items/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C02H09-01');
      }
    });
    it(`should return status 500 when category tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H09-02');
    });
    it(`should return status 404 when category was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H09-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H09-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C02H09-05');
    });
    it(`should return status 500 when item tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, removeItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = setup.instance.categories[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C02H09-06');
    });
    it(`should return status 200 when item was found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsRemoved();
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from category' ];
      let category_id = setup.instance.categories[1].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${category_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
