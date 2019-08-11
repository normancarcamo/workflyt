const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/warehouses';
const mocks = require('./warehouses-mocks');

describe('Warehouse Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/warehouses/warehouses-repository');
  });

  // Warehouse ----------------------------------------------------------------

  describe('get warehouses:', () => {
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
        setup.assertError(expect, res, 403, 'C15H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouses' ];
      let options = { name: 'abcdefghijklmnopqrstuvwxyz1234567890' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 400, 'C15H01-01');
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouses' ];
      let options = { name: 'steel' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H01-02');
    });
    it(`should return status 200 when warehouses were filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.warehousesAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouses' ];
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'El Prado' } ],
        [ 3, { name: { like: '%rado%' } } ],
        [ 4, { name: 'El Prado', include: 'items' } ],
        [ 5, { name: 'Villa Vieja', include: [ 'items' ] } ],
        [ 6, { name: 'Villa Vieja', attributes: 'id,code,name' } ],
        [ 7, { name: 'El Prado', attributes: [ 'id', 'code', 'name' ] } ],
        [ 8, { limit: 2 } ],
        [ 9, { offset: 1 } ],
        [ 10, { offset: 1, limit: 5 } ]
      ];

      for (let [ id, options ] of payload) {
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
          expect(res.body.data[0]).toHaveProperty('name', 'El Prado');
        }

        if (id === 3) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'El Prado');
        }

        if (id === 4) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'El Prado');
          expect(res.body.data[0].items).toBeArray();
        }

        if (id === 5) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Villa Vieja');
          expect(res.body.data[0].items).toBeArray();
        }

        if ([6,7].includes(id)) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toContainAllKeys([ 'id', 'code', 'name' ]);
        }

        if (id === 8) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(2);
        }

        if ([9,10].includes(id)) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
        }
      }
    });
  });

  describe('create warehouses:', () => {
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
        setup.assertError(expect, res, 403, 'C15H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create warehouses' ];
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
        setup.assertError(expect, res, 400, 'C15H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create warehouses' ];
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H02-02');
    });
    it(`should return status 200 when warehouse is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.warehouseIsCreated({ setup })
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create warehouses' ];

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 201);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.name).toBe('demo');
    });
  });

  describe('get warehouse:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdkdnkdndkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouse' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd',
          {}
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          { attributes: 'sssmsm' }
        ]
      ];

      for (let [ id, warehouse_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H03-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let keys = [ 'name', 'message', 'code', 'status' ];

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H03-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouse' ];
      let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H03-03');
    });
    it(`should return status 200 when warehouse is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.warehouseIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data).toContainAnyKeys(Object.keys(
        setup.instance.warehouses[0].dataValues
      ));
      expect(res.body.data.id).toBe(warehouse_id);
      expect(res.body.data.name).toBeString();
      expect(res.body.data.name).not.toBeEmpty();
      expect(res.body.data.deleted_at).toBe(null);
    });
  });

  describe('update warehouse:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdnkdn' ] ]
      ]

      for (let [ id, permissions] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.warehouses[0].id}`)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update warehouse' ];
      let payload = [
        { id: 234 },
        { name: '' },
      ];

      for (let data of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.warehouses[0].id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H04-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update warehouse' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.warehouses[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H04-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update warehouse' ];
      let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H04-03');
    });
    it(`should return status 500 when warehouse tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update warehouse' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.warehouses[0].id}`)
        .send({ name: 'name' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H04-04');
    });
    it(`should return status 200 when warehouse was updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.warehouseIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update warehouse' ];
      let oldName = setup.instance.warehouses[0].name;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.warehouses[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.name).not.toBe(oldName);
      expect(res.body.data.name).toBe('demo');
      expect(res.body.data.updated_at).not.toBe(null);
    });
  });

  describe('delete warehouse:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmkdkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${warehouse_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete warehouse' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.warehouses[0].id, { force:'nanana' } ]
      ];

      for (let [ id, warehouse_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${warehouse_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H05-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${warehouse_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H05-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete warehouse' ];
      let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${warehouse_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H05-03');
    });
    it(`should return status 500 when warehouse tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${warehouse_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H05-04');
    });
    it(`should return status 200 when warehouse was deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.warehouseIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${warehouse_id}`)
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

  // Item ---------------------------------------------------------------------

  describe('get items', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}/items`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from warehouse' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.warehouses[0].id, { id: 33223 } ],
        [ 3, setup.instance.warehouses[0].id, { paranoid: 'ldfdfm' } ]
      ];

      for (let [ id, warehouse_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H06-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H06-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from warehouse' ];
      let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H06-03');
    });
    it(`should return status 500 when items tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H06-04');
    });
    it(`should return status 200 when items are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from warehouse' ];
      let payload = [
        [
          1,
          setup.instance.warehouses[0].id,
          {}
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          { category_id: setup.instance.categories[1].id }
        ],
        [
          3,
          setup.instance.warehouses[0].id,
          { name: 'Logo design' }
        ],
        [
          4,
          setup.instance.warehouses[0].id,
          { limit: 1 }
        ],
        [
          5,
          setup.instance.warehouses[0].id,
          { offset: 1, limit: 1 }
        ],
        [
          6,
          setup.instance.warehouses[0].id,
          { sort_by: 'name', order_by: 'asc' }
        ],
        [
          7,
          setup.instance.warehouses[0].id,
          { sort_by: 'name', order_by: 'desc' }
        ],
      ];

      for (let [ id, warehouse_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if ([1,2,3,4,5,6,7].includes(id)) {
          expect(res.body.data).not.toBeEmpty();
        }
        if ([2].includes(id)) {
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].category_id).toEqual(
            setup.instance.categories[1].id
          );
        }
        if ([3].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toEqual('Logo design');
        }
      }
    });
  });

  describe('add items', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let items = setup.instance.items.map(item => item.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${warehouse_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to warehouse' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items.map(item => item.id)
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
      ];

      for (let [ id, warehouse_id, items ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${warehouse_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H07-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${warehouse_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H07-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to warehouse' ];
      let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${warehouse_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H07-03');
    });
    it(`should return status 500 when items tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${warehouse_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H07-04');
    });
    it(`should return status 200 when items were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreAdded({ setup })
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let items = setup.instance.items.slice(2, 3).map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${warehouse_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get item', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id,
          {}
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {}
        ],
        [
          4,
          setup.instance.warehouses[0].id,
          setup.instance.items[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, warehouse_id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H08-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H08-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let warehouse_id = 'f5eacdd2-95e8-4fa9-a12a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H08-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H08-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H08-05');
    });
    it(`should return status 200 when item is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let items = await setup.instance.warehouses[0].getItems({});

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${warehouse_id}/items/${items[0].id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(items[0].id);
    });
  });

  describe('update item', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H09-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id,
          { extra: { units: 20 } },
          [ 'update item from warehouse' ]
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from warehouse' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from warehouse' ]
        ],
        [
          4,
          setup.instance.warehouses[0].id,
          setup.instance.items[0].id,
          { name: '' },
          [ 'update item from warehouse' ]
        ],
      ];

      for (let [ id, warehouse_id, item_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H09-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 12 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H09-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H09-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H09-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H09-05');
    });
    it(`should return status 500 when item tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, updateItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H09-06');
    });
    it(`should return status 200 when item is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from warehouse' ];
      let warehouse = setup.instance.warehouses[0];
      let items = await warehouse.getItems({});
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${warehouse.id}/items/${items[0].id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove item', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C15H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Setup:
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id
        ],
        [
          2,
          setup.instance.warehouses[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      ];

      for (let [ id, warehouse_id, item_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C15H10-01');
      }
    });
    it(`should return status 500 when warehouse tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H10-02');
    });
    it(`should return status 404 when warehouse was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H10-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H10-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C15H10-05');
    });
    it(`should return status 500 when item tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, removeItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C15H10-06');
    });
    it(`should return status 200 when item is removed`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsRemoved({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from warehouse' ];
      let warehouse_id = setup.instance.warehouses[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${warehouse_id}/items/${item_id}`)
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

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
