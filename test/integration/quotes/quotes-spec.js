const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/quotes';
const mocks = require('./quotes-mocks');

describe('Quote Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/quotes/quotes-repository');
  });

  // Quotes -------------------------------------------------------------------

  describe('get quotes:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let payload = [
        [ 1, [], { subject: 'demo' } ],
        [ 2, [ 'knfkdnfkdf' ], { subject: 'demo' } ],
      ];

      for (let [ id, permissions, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes' ];
      let payload = [
        [ 1, { id: 'demo' } ],
        [ 2, { dmdmdm: 'demo' } ]
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
        setup.assertError(expect, res, 400, 'C10H01-01');
      }
    });
    it(`should return status 500 when action fail`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes' ];

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H01-02');
    });
    it(`should return status 200 when quotes are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quotesAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes' ];
      let cases = [
        [ 1, {} ],
        [ 2, { subject: 'Stickers for furniture 2x24' } ],
        [ 3, { subject: 'nnnnnnn' } ],
        [ 4, { subject: { like: '%cker%' } } ]
      ];

      for (let [ id, options ] of cases) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);

        if (id === 1) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
        }

        if (id === 2) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].subject).toBe(
            'Stickers for furniture 2x24'
          );
        }

        if (id === 3) {
          expect(res.body.data).toBeArray().toBeEmpty();
        }

        if (id === 4) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].subject).toBe(
            'Stickers for furniture 2x24'
          );
        }
      }
    });
  });

  describe('create quote:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Setup:
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdkdmdkmd' ] ],
      ];
      let data = {
        customer_id: setup.instance.customers[0].id,
        salesman_id: setup.instance.employees[0].id,
        subject: 'mmmmmmmmmm'
      };

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create quotes' ];
      let payload = [
        [
          1,
          {
            customer_id: setup.instance.customers[0].id,
            salesman_id: setup.instance.employees[0].id,
            subject: 'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm '
          }
        ],
        [
          2,
          {
            customer_id: null,
            salesman_id: setup.instance.employees[0].id,
            subject: 'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm '
          }
        ],
        [
          3,
          {
            customer_id: setup.instance.customers[0].id,
            salesman_id: null,
            subject: 'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm '
          }
        ],
        [
          4,
          {
            customer_id: null,
            salesman_id: null,
            subject: 'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm ' +
                     'mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm mmmmmmmmmm '
          }
        ],
        [
          5,
          {
            customer_id: null,
            salesman_id: null,
            subject: null
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
        setup.assertError(expect, res, 400, 'C10H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      jest.spyOn(setup.models.Quote, 'create').mockImplementation(
        async data => {
          throw new Error('error mocked.');
        }
      );
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create quotes' ];
      let data = {
        customer_id: setup.instance.customers[0].id,
        salesman_id: setup.instance.employees[0].id,
        subject: 'demo subject description'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H02-02');
    });
    it(`should return status 200 when quote is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create quotes' ];
      let data = {
        customer_id: setup.instance.customers[0].id,
        salesman_id: setup.instance.employees[0].id,
        subject: 'demo subject description'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 201);
    });
  });

  describe('get quote:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmdkm' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}`)
          .query({})
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 400, 'C10H03-01');
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H03-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H03-03');
    });
    it(`should return status 200 when quote is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(quote_id);
    });
  });

  describe('update quote:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmdkm' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${quote_id}`)
          .send({ subject: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { subject: 'dkmdkdmkd' },
          {}
        ],
        [
          2,
          setup.instance.quotes[0].id,
          { id: 2323 },
          {}
        ],
        [
          3,
          setup.instance.quotes[0].id,
          { subject: 'demo' },
          { unknown: 'fdlmdl' }
        ],
        [
          4,
          setup.instance.quotes[0].id,
          { subject: 'demo' },
          { paranoid: 'ssssss' }
        ]
      ];

      for (let [ id, quote_id, data, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${quote_id}`)
          .query(options)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H04-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let data = { status: 'cancelled' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H04-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { status: 'cancelled' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H04-03');
    });
    it(`should return status 500 when quote tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let data = { status: 'cancelled' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H04-04');
    });
    it(`should return status 200 when quote is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}`)
        .send({ status: 'cancelled' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete quote:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.spyOn(setup.models.Quote, 'findByPk').mockImplementation(
          async (id, options) => ({
            destroy: async (options) => {
              let quote = setup.instance.quotes[0];
              quote.deleted_at = new Date().toISOString();
              return quote;
            }
          })
        );
      }

      // Arrange:
      let app = require('src/app.js');
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkdkd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${quote_id}`)
          .query({})
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete quote' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.quotes[0].id, { force: 'nanana' } ]
      ];

      for (let [ id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${quote_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H05-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H05-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H05-03');
    });
    it(`should return status 500 when quote tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H05-04');
    });
    it(`should return status 200 when quote is deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete quote' ];
      let quote_id = setup.instance.quotes[0].id;
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
          .delete(`${API_BASE}/${quote_id}`)
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

  describe('get items', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/items`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from quote' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.quotes[0].id, { id: 33223 } ],
        [ 3, setup.instance.quotes[0].id, { paranoid: 'ldfdfm' } ]
      ];

      for (let [ id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H06-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H06-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H06-03');
    });
    it(`should return status 500 when items tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H06-04');
    });
    it(`should return status 200 when items are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from quote' ];
      let payload = [
        [
          1,
          setup.instance.quotes[0].id,
          {}
        ],
        [
          2,
          setup.instance.quotes[0].id,
          { category_id: setup.instance.categories[1].id }
        ],
        [
          3,
          setup.instance.quotes[0].id,
          { name: 'Stickers design' }
        ],
        [
          4,
          setup.instance.quotes[0].id,
          { limit: 1 }
        ],
        [
          5,
          setup.instance.quotes[0].id,
          { offset: 0, limit: 1 }
        ],
        [
          6,
          setup.instance.quotes[0].id,
          { sort_by: 'name', order_by: 'asc' }
        ],
        [
          7,
          setup.instance.quotes[0].id,
          { sort_by: 'name', order_by: 'desc' }
        ],
      ];

      for (let [ id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/items`)
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
          expect(res.body.data[0].name).toEqual('Stickers design');
        }
        if ([4].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
        }
        if ([5].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
        }
        if ([6].includes(id)) {
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toEqual('Stickers design');
        }
        if ([7].includes(id)) {
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toEqual('Stickers design');
        }
      }
    });
  });

  describe('add items', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = setup.instance.quotes[0].id;
      let items = setup.instance.items.map(item => item.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${quote_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items.map(item => item.id)
        ],
        [
          2,
          setup.instance.quotes[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
      ];

      for (let [ id, quote_id, items ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${quote_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H07-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H07-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H07-03');
    });
    it(`should return status 500 when items tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H07-04');
    });
    it(`should return status 200 when items were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let items = setup.instance.items.slice(1, 2).map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/items`)
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
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id,
          {}
        ],
        [
          2,
          setup.instance.quotes[0].id,
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
          setup.instance.quotes[0].id,
          setup.instance.items[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, quote_id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/items/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H08-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H08-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let quote_id = 'f5eacdd2-95e8-4fa9-a12a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H08-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H08-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H08-05');
    });
    it(`should return status 200 when item is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let items = await setup.instance.quotes[0].getItems({});

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/items/${items[0].id}`)
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
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${quote_id}/items/${item_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H09-00');
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
          [ 'update item from quote' ]
        ],
        [
          2,
          setup.instance.quotes[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from quote' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from quote' ]
        ],
        [
          4,
          setup.instance.quotes[0].id,
          setup.instance.items[0].id,
          { name: '' },
          [ 'update item from quote' ]
        ],
      ];

      for (let [ id, quote_id, item_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${quote_id}/items/${item_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H09-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 12 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H09-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H09-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H09-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H09-05');
    });
    it(`should return status 500 when item tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, updateItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H09-06');
    });
    it(`should return status 200 when item is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from quote' ];
      let quote = setup.instance.quotes[0];
      let items = await quote.getItems({});
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${quote.id}/items/${items[0].id}`)
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
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Setup:
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id
        ],
        [
          2,
          setup.instance.quotes[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      ];

      for (let [ id, quote_id, item_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H10-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H10-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H10-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H10-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H10-05');
    });
    it(`should return status 500 when item tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, removeItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H10-06');
    });
    it(`should return status 200 when item is removed`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsRemoved({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from quote' ];
      let quote = setup.instance.quotes[0];
      let items = await quote.getItems({});
      let quote_id = quote.id;
      let item_id = items[0].id
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
          .delete(`${API_BASE}/${quote_id}/items/${item_id}`)
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

  // Orders -------------------------------------------------------------------

  describe('get orders:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdnkdnd' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/orders`)
          .query({})
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H11-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders from quote' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.quotes[0].id, { id: 'sksks' } ]
      ];

      for (let [ id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/orders`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H11-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders from quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H11-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders from quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H11-03');
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getOrders: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders from quote' ];
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H11-04');
    });
    it(`should return status 200 when orders are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.ordersAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { type: 'work' } ],
        [ 3, { limit: 1 } ],
        [ 4, { offset: 0 } ],
        [ 5, { offset: 0, limit: 1 } ],
        [ 6, { quote_id: '0c52c0fa-2cbf-442c-a2a6-9e9f5d0d7d4e' } ],
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/orders`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if ([1,2,3,4,5].includes(id)) {
          expect(res.body.data).not.toBeEmpty();
        } else {
          expect(res.body.data).toBeEmpty();
        }
      }
    });
  });

  describe('add orders:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let orders = setup.instance.orders.map(e => e.id)[0];
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdndk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${setup.instance.quotes[0].id}/orders`)
          .send({ orders })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H12-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add orders to quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          []
        ],
        [
          2,
          setup.instance.quotes[0].id,
          []
        ],
        [
          3,
          setup.instance.quotes[0].id,
          [ 'dkndkndknd', 'dddmdmdm' ]
        ]
      ];

      for (let [ id, quote_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${quote_id}/orders`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H12-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add orders to quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let orders = setup.instance.orders.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/orders`)
        .send({ orders })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H12-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add orders to quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let orders = setup.instance.orders.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/orders`)
        .send({ orders })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H12-03');
    });
    it(`should return status 500 when orders tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addOrders: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add orders to quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let orders = setup.instance.orders.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote_id}/orders`)
        .send({ orders })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H12-04');
    });
    it(`should return status 200 when orders has been added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.ordersAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add orders to quote' ];
      let quote = setup.instance.quotes[0];
      let orders = setup.instance.orders.slice(0, 2).map(o => o.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${quote.id}/orders`)
        .send({ orders })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get order:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmkdmd' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
          .query({})
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C10H13-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.orders[0].id,
          {}
        ],
        [
          2,
          setup.instance.quotes[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {}
        ],
        [
          4,
          setup.instance.quotes[0].id,
          setup.instance.orders[0].id,
          { unknown: 'dkdkdn' }
        ],
      ];

      for (let [ id, quote_id, order_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C10H13-01');
      }
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H13-02');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H13-03');
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getOrder: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C10H13-04');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getOrder: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C10H13-05');
    });
    it(`should return status 200 when order is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.orderIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order from quote' ];
      let quote_id = setup.instance.quotes[0].id;
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${quote_id}/orders/${order_id}`)
        .query({})
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
