const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/stocks';
const mocks = require('./stocks-mocks');

describe('Stock Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/stocks/stocks-repository');
  });

  describe('get stocks:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkndkdn' ] ],
      ];

      for (let [ id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ stocks })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C12H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks' ];
      let payload = [
        [ 1, { search: null } ],
        [ 2, { attributes: 'aaaaan' } ],
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
        setup.assertError(expect, res, 400, 'C12H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks' ];

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query({ entries: 5 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H01-02');
    });
    it(`should return status 200 when stocks are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stocksAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks' ];
      let payload = [
        [ 1, {} ],
        [ 2, { stock: 100 } ],
        [ 3, { exits: { gt: 1000 } } ]
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
        expect(res.body.data).toBeArray().not.toBeEmpty();
      }
    });
  });

  describe('create stocks:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdnkdnkdnd' ] ]
      ];

      for (let [ id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'ananana' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ stocks })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C12H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create stocks' ];
      let payload = [
        [ 1, { entries: 'dkndknd' } ],
        [ 2, { unknown: 'neeee' } ],
        [ 3, { id: 3833 } ]
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
        setup.assertError(expect, res, 400, 'C12H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create stocks' ];

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send({ entries: 400, item_id: setup.instance.items[0].id })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H02-02');
    });
    it(`should return status 200 when stock is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stockIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create stocks' ];
      let payload = [
        [
          1,
          {
            item_id: setup.instance.items[0].id,
            entries: 50
          }
        ],
        [
          2,
          {
            item_id: setup.instance.items[0].id,
            entries: 120,
            created_by: setup.instance.users[0].id
          }
        ]
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
        setup.assertOk(expect, res, 201);
        expect(res.body.data).toBeObject().not.toBeEmpty();
        if (id === 1) {
          expect(res.body.data.created_by).toBe(null);
        } else {
          expect(res.body.data.created_by).toBe(setup.instance.users[0].id);
        }
      }
    });
  });

  describe('get Stock:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdnkdnkdnd' ] ]
      ];

      for (let [ id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.stocks[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ stocks })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C12H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, '11bf5', {} ],
        [ 3, setup.instance.stocks[0].id, { attributes: 'anaaa' } ]
      ];

      for (let [ id, stock_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${stock_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C12H03-01');
      }
    });
    it(`should return status 500 when stock tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock' ];
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H03-02');
    });
    it(`should return status 404 when stock was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock' ];
      let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C12H03-03');
    });
    it(`should return status 200 when stock is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stockIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock' ];
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(stock_id);
    });
  });

  describe('update Stock:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let stock_id = setup.instance.stocks[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kndkdndkdn' ] ],
      ];

      for (let [ id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${stock_id}`)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ stocks })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C12H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update stock' ];
      let stock_id = setup.instance.stocks[0].id;
      let payload = [
        [ 1, { id: 2443 } ],
        [ 2, { entries: -34 } ],
        [ 3, { item_id: setup.instance.items[2].id } ],
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${stock_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C12H04-01');
      }
    });
    it(`should return status 500 when stock tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update stock' ];
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${stock_id}`)
        .send({ exits: 234 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H04-02');
    });
    it(`should return status 404 when stock was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update stock' ];
      let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${stock_id}`)
        .send({ exits: 32 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C12H04-03');
    });
    it(`should return status 500 when stock tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update stock' ];
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${stock_id}`)
        .send({ exits: 23 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H04-04');
    });
    it(`should return status 200 when stock is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stockIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update stock' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.stocks[0].id}`)
        .send({ exits: 322 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('delete Stock:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [];
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkndknd' ] ]
      ];

      for (let [ id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${setup.instance.stocks[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C12H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete stock' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.stocks[0].id, { attributes: 'sknsksnk' } ],
      ];

      for (let [ id, stock_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${stock_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C12H05-01');
      }
    });
    it(`should return status 500 when stock tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete stock' ];
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H05-02');
    });
    it(`should return status 404 when stock was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete stock' ];
      let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C12H05-03');
    });
    it(`should return status 500 when stock tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete stock' ];

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${setup.instance.stocks[0].id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C12H05-04');
    });
    it(`should return status 200 when stock has been deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stockIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete stock' ];
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];
      let stock_id = setup.instance.stocks[0].id;

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${stock_id}`)
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
