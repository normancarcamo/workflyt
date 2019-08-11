const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/orders';
const mocks = require('./orders-mocks');

describe.only('Order Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/orders/orders-repository');
  });

  // Orders -------------------------------------------------------------------

  describe('get orders:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdnd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders' ];
      let payload = [
        [ 1, { code: 'kdkdnkdnd' } ],
        [ 2, { id: 24323 } ],
        [ 3, { id: setup.instance.orders[0].id } ],
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
        setup.assertError(expect, res, 400, 'C08H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders' ];
      let options = { code: 'ORD/00001' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H01-02');
    });
    it(`should return status 200 when orders are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.ordersAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get orders' ];
      let payload = [
        [ 1, {} ],
        [ 2, { quote_id: setup.instance.quotes[0].id } ],
        [ 3, { code: setup.instance.orders[0].code } ],
        [ 4, { type: 'work' } ],
        [ 5, { type: 'installation' } ],
        [ 6, { status: 'done' } ],
        [ 7, { limit: 1 } ],
        [ 8, { offset: 0, limit: 2 } ],
        [ 9, { attributes: [ 'code', 'type', 'status' ] } ],
        [ 10, { attributes: 'code,type,status' } ],
        [ 11, { paranoid: true } ],
        [ 12, { include: 'quote' } ],
        [ 13, { include: 'quote,departments' } ],
        [ 14, { include: [ 'quote', 'departments', 'items', 'employees' ] } ],
        [ 15, { order_by: 'asc' } ], // no effect, must be used with sort_by
        [ 16, { order_by: 'desc' } ], // no effect, must be used with sort_by
        [ 17, { sort_by: 'status' } ], // order_by 'asc' is the default order.
        [ 18, { sort_by: 'status', order_by: 'asc' } ], // same as the previous
        [ 19, { sort_by: 'status', order_by: 'desc' } ],
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
        expect(res.body.data).toBeArray();

        if (id === 1) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 2) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].quote_id).toEqual(
            setup.instance.quotes[0].id
          );
        }
        if (id === 3) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].code).toEqual(
            setup.instance.orders[0].code
          );
        }
        if (id === 4) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toBeObject().not.toBeEmpty();
            expect(element.type).toEqual('work');
          }
        }
        if (id === 5) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toBeObject().not.toBeEmpty();
            expect(element.type).toEqual('installation');
          }
        }
        if (id === 6) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toBeObject().not.toBeEmpty();
            expect(element.status).toEqual('done');
          }
        }
        if (id === 7) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
        }
        if (id === 8) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(2);
        }
        if (id === 9 || id === 10) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toContainAllKeys([ 'code', 'type', 'status' ]);
          }
        }
        if (id === 11) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 12) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toHaveProperty('quote');
          }
        }
        if (id === 13) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            // expect(element).toHaveProperty('quote');
            expect(element).toHaveProperty('departments');
            expect(element.departments).toBeArray();
          }
        }
        if (id === 14) {
          expect(res.body.data).not.toBeEmpty();
          for (let element of res.body.data) {
            expect(element).toHaveProperty('quote');
            expect(element).toHaveProperty('departments');
            expect(element.departments).toBeArray();
            expect(element).toHaveProperty('items');
            expect(element.items).toBeArray();
            expect(element).toHaveProperty('employees');
            expect(element.employees).toBeArray();
          }
        }
        if (id === 15 || id === 16) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].status).toBe('cancelled');
          expect(res.body.data[1].status).toBe('awaiting');
          expect(res.body.data[2].status).toBe('done');
          expect(res.body.data[3].status).toBe('done');
        }
        if (id === 17 || id === 18) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].status).toBe('done');
          expect(res.body.data[1].status).toBe('done');
          expect(res.body.data[2].status).toBe('cancelled');
          expect(res.body.data[3].status).toBe('awaiting');
        }
        if (id === 19) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].status).toBe('awaiting');
          expect(res.body.data[1].status).toBe('cancelled');
          expect(res.body.data[2].status).toBe('done');
          expect(res.body.data[3].status).toBe('done');
        }
      }
    }, 30000);
  });

  describe('create order:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkdkdmkdmkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ quote_id: 'jknkjdnkjfdnd', code: 'ed' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create orders' ];
      let payload = [
        [ 1, { quote_id: 'jknkjdnkjfdnd' } ],
        [ 2, { quote_id: setup.instance.quotes[0].id, code: '' } ],
        [ 3, {} ]
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
        setup.assertError(expect, res, 400, 'C08H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create orders' ];
      let data = {
        quote_id: setup.instance.quotes[0].id,
        type: 'work',
        status: 'working'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H02-02');
    });
    it(`should return status 201 when order is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.orderIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create orders' ];
      let data = {
        quote_id: setup.instance.quotes[0].id,
        type: 'work',
        status: 'working'
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
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.quote_id).toBe(data.quote_id);
      expect(res.body.data.type).toBe('work');
      expect(res.body.data.status).toBe('working');
    });
  });

  describe('get order:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, setup.instance.orders[0].id, { attributes: 'naaa' } ]
      ];

      for (let [ id, order_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H03-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H03-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H03-03');
    });
    it(`should return status 200 when order is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.orderIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(order_id);
    });
  });

  describe('update order:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}`)
          .send({ type: 'installation' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update order' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { id: 42 } ],
        [ 2, setup.instance.orders[0].id, {} ]
      ];

      for (let [ id, order_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H04-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update order' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.orders[0].id}`)
        .send({ status: 'cancelled' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H04-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}`)
        .send({ status: 'cancelled' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H04-03');
    });
    it(`should return status 500 when order tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}`)
        .send({ status: 'cancelled' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H04-04');
    });
    it(`should return status 200 when order is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.orderIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}`)
        .send({ status: 'cancelled' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete order:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete order' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.orders[0].id, { force: 'nanana' } ]
      ];

      for (let [ id, order_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H05-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H05-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H05-03');
    });
    it(`should return status 500 when order tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H05-04');
    });
    it(`should return status 200 when order is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.orderIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete order' ];
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}`)
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
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/items`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from order' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.orders[0].id, { id: 33223 } ],
        [ 3, setup.instance.orders[0].id, { paranoid: 'ldfdfm' } ]
      ];

      for (let [ id, order_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/items`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H06-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H06-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H06-03');
    });
    it(`should return status 500 when items tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H06-04');
    });
    it(`should return status 200 when items are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.itemsAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items from order' ];
      let payload = [
        [
          1,
          setup.instance.orders[0].id,
          {}
        ],
        [
          2,
          setup.instance.orders[0].id,
          { category_id: setup.instance.categories[1].id }
        ],
        [
          3,
          setup.instance.orders[0].id,
          { name: 'Logo design' }
        ],
        [
          4,
          setup.instance.orders[0].id,
          { limit: 1 }
        ],
        [
          5,
          setup.instance.orders[0].id,
          { offset: 1, limit: 1 }
        ],
        [
          6,
          setup.instance.orders[0].id,
          { sort_by: 'name', order_by: 'asc' }
        ],
        [
          7,
          setup.instance.orders[0].id,
          { sort_by: 'name', order_by: 'desc' }
        ],
      ];

      for (let [ id, order_id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/items`)
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
          expect(res.body.data[0].name).toEqual('Logo design');
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
      let order_id = setup.instance.orders[0].id;
      let items = setup.instance.items.map(item => item.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to order' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items.map(item => item.id)
        ],
        [
          2,
          setup.instance.orders[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
      ];

      for (let [ id, order_id, items ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/items`)
          .send({ items })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H07-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to order' ];
      let order_id = setup.instance.orders[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H07-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H07-03');
    });
    it(`should return status 500 when items tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addItems: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to order' ];
      let order_id = setup.instance.orders[0].id;
      let items = setup.instance.items.map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/items`)
        .send({ items })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H07-04');
    });
    it(`should return status 200 when items were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemsAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add items to order' ];
      let order_id = setup.instance.orders[0].id;
      let items = setup.instance.items.slice(1,2).map(item => item.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/items`)
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
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id,
          {}
        ],
        [
          2,
          setup.instance.orders[0].id,
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
          setup.instance.orders[0].id,
          setup.instance.items[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, order_id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/items/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H08-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H08-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a12a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H08-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H08-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H08-05');
    });
    it(`should return status 200 when item is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item from order' ];
      let order_id = setup.instance.orders[0].id;
      let items = await setup.instance.orders[0].getItems({});

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/items/${items[0].id}`)
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
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/items/${item_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H09-00');
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
          [ 'update item from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update item from order' ]
        ],
        [
          4,
          setup.instance.orders[0].id,
          setup.instance.items[0].id,
          { name: '' },
          [ 'update item from order' ]
        ],
      ];

      for (let [ id, order_id, item_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/items/${item_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H09-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 12 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H09-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H09-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H09-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H09-05');
    });
    it(`should return status 500 when item tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, updateItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/items/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H09-06');
    });
    it(`should return status 200 when item is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item from order' ];
      let order = setup.instance.orders[0];
      let items = await order.getItems({});
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order.id}/items/${items[0].id}`)
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
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Setup:
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.items[0].id
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      ];

      for (let [ id, order_id, item_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/items/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H10-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H10-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H10-03');
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H10-04');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getItem: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H10-05');
    });
    it(`should return status 500 when item tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getItem: false, removeItem: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/items/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H10-06');
    });
    it(`should return status 200 when item is removed`, async () => {
      // Setup:
      let cycle = { _id: null };
      if (setup.is_mocked) {
        mocks.itemIsRemoved({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove item from order' ];
      let order_id = setup.instance.orders[0].id;
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/items/${item_id}`)
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

  // Departments --------------------------------------------------------------

  describe('get departments', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/departments`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H11-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {},
          [ 'get departments from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          { limit: 'ww' },
          [ 'get departments from order' ]
        ]
      ];

      for (let [ id, order_id, options, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/departments`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H11-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H11-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments from order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H11-03');
    });
    it(`should return status 500 when departments tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H11-04');
    });
    it(`should return status 200 when departments are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.departmentsAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments from order' ];
      let order_id = setup.instance.orders[2].id;
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'Printing' } ],
        [ 3, { name: { like: '%ales%' } } ],
        [ 4, { limit: 2 } ],
        [ 5, { offset: 1, limit: 1 } ],
        [ 6, { limit: 1, attributes: 'id,code,name' } ],
        [ 7, { limit: 1, attributes: [ 'id', 'code', 'name' ] } ],
        [ 8, { limit: 1, include: 'employees' } ],
        [ 9, { limit: 1, include: [ 'employees' ] } ],
        [ 10, { name: 'sksksksm' } ],
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/departments`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if ([1,2,3,4,5,6,7,8,9].includes(id)) {
          expect(res.body.data).not.toBeEmpty();
        }
        if ([2].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Printing');
        }
        if ([3].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Sales');
        }
        if ([4].includes(id)) {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[1]).toBeObject().not.toBeEmpty();
        }
        if ([5].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Sales');
        }
        if ([6,7].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toContainAllKeys([
            'id', 'code', 'name', 'OrderDepartment'
          ]);
        }
        if ([8].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('employees');
          expect(res.body.data[0].employees).toBeArray();
        }
        if ([9].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('employees');
          expect(res.body.data[0].employees).toBeArray();
        }
        if ([10].includes(id)) {
          expect(res.body.data).toBeEmpty();
        }
      }
    });
  });

  describe('add departments', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let departments = setup.instance.departments.map(dep => dep.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/departments`)
          .send({ departments })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H12-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.departments.map(dep => dep.id),
          [ 'add departments to order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add departments to order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add departments to order' ]
        ],
      ];

      for (let [ id, order_id, departments, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/departments`)
          .send({ departments })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H12-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add departments to order' ];
      let order_id = setup.instance.orders[0].id;
      let departments = setup.instance.departments.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/departments`)
        .send({ departments })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H12-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add departments to order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let departments = setup.instance.departments.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/departments`)
        .send({ departments })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H12-03');
    });
    it(`should return status 500 when departments tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addDepartments: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add departments to order' ];
      let order_id = setup.instance.orders[0].id;
      let departments = setup.instance.departments.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/departments`)
        .send({ departments })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H12-04');
    });
    it(`should return status 200 when departments are added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.departmentsAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add departments to order' ];
      let order_id = setup.instance.orders[0].id;
      let departments = setup.instance.departments.slice(1, 2).map(d => d.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/departments`)
        .send({ departments })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get department', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/departments/${department_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H13-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.departments[0].id,
          [ 'get department from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          [ 'get department from order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ 'get department from order' ]
        ]
      ];

      for (let [ id, order_id, department_id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/departments/${department_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H13-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H13-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H13-03');
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H13-04');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getDepartment: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H13-05');
    });
    it(`should return status 200 when department is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.departmentIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('update department', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/departments/${department_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H14-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.departments[0].id,
          { extra: { units: 20 } },
          [ 'update department from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update department from order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update department from order' ]
        ],
        [
          4,
          setup.instance.orders[0].id,
          setup.instance.departments[0].id,
          {},
          [ 'update department from order' ]
        ]
      ];

      for (let [ id, order_id, department_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/departments/${department_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H14-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H14-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let department_id = setup.instance.departments[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H14-03');
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H14-04');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getDepartment: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H14-05');
    });
    it(`should return status 500 when department tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: false, updateDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H14-06');
    });
    it(`should return status 200 when department is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.departmentIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/departments/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove department', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H15-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.departments[0].id,
          {}
        ],
        [
          2,
          setup.instance.orders[0].id,
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
          setup.instance.orders[0].id,
          setup.instance.departments[0].id,
          { force: 'kndkdkdn' }
        ],
        [
          5,
          setup.instance.orders[0].id,
          setup.instance.departments[0].id,
          { paranoid: 'kndkdkdn' }
        ],
      ];

      for (let [ id, order_id, department_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H15-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H15-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H15-03');
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H15-04');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getDepartment: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H15-05');
    });
    it(`should return status 500 when department tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getDepartment: false, removeDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H15-06');
    });
    it(`should return status 200 when department is removed`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.departmentIsRemoved({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove department from order' ];
      let order_id = setup.instance.orders[0].id;
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/departments/${department_id}`)
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

  // Employees ----------------------------------------------------------------

  describe('get employees', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/employees`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H16-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          {},
          [ 'get employees from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          { limit: 'ww' },
          [ 'get employees from order' ]
        ]
      ];

      for (let [ id, order_id, options, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/employees`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H16-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H16-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H16-03');
    });
    it(`should return status 500 when employees tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployees: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from order' ];
      let order_id = setup.instance.orders[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H16-04');
    });
    it(`should return status 200 when employees are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeesAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from order' ];
      let order_id = setup.instance.orders[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { firstname: 'Luis' } ],
        [ 3, { firstname: { like: '%uis%' } } ],
        [ 4, { limit: 2 } ],
        [ 5, { offset: 0, limit: 1 } ],
        [ 6, { limit: 1, attributes: 'id,code,firstname' } ],
        [ 7, { limit: 1, attributes: [ 'id', 'code', 'firstname' ] } ],
        // Associations of employee: departments, supervisors, user, quotes, orders.
        [ 8, { limit: 1, include: 'supervisors' } ],
        [ 9, { limit: 1, include: [ 'supervisors' ] } ],
        [ 10, { firstname: 'sksksksm' } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/employees`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if ([1,2,3,4,5,6,7,8,9].includes(id)) {
          expect(res.body.data).not.toBeEmpty();
        }
        if ([2].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('firstname', 'Luis');
        }
        if ([3].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('firstname', 'Luis');
        }
        if ([4].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
        }
        if ([5].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('firstname', 'Luis');
        }
        if ([6,7].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toContainAllKeys([
            'id', 'code', 'firstname', 'OrderEmployee'
          ]);
        }
        if ([8].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('supervisors');
          expect(res.body.data[0].supervisors).toBeArray();
        }
        if ([9].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('supervisors');
          expect(res.body.data[0].supervisors).toBeArray();
        }
        if ([10].includes(id)) {
          expect(res.body.data).toBeEmpty();
        }
      }
    });
  });

  describe('add employees', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let employees = setup.instance.employees.map(emp => emp.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/employees`)
          .send({ employees })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H17-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees.map(dep => dep.id),
          [ 'add employees to order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add employees to order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add employees to order' ]
        ],
      ];

      for (let [ id, order_id, employees, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${order_id}/employees`)
          .send({ employees })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H17-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to order' ];
      let order_id = setup.instance.orders[0].id;
      let employees = setup.instance.employees.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H17-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to order' ];
      let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let employees = setup.instance.employees.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H17-03');
    });
    it(`should return status 500 when employees tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addEmployees: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to order' ];
      let order_id = setup.instance.orders[0].id;
      let employees = setup.instance.employees.map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H17-04');
    });
    it(`should return status 200 when employees are added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeesAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to order' ];
      let order_id = setup.instance.orders[0].id;
      let employees = setup.instance.employees.slice(1, 2).map(d => d.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${order_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get employee', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H18-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees[0].id,
          [ 'get employee from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          [ 'get employee from order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ 'get employee from order' ]
        ]
      ];

      for (let [ id, order_id, employee_id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H18-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H18-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H18-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H18-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getEmployee: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H18-05');
    });
    it(`should return status 200 when employee is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeeIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('update employee', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H19-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees[0].id,
          { extra: { units: 20 } },
          [ 'update employee from order' ]
        ],
        [
          2,
          setup.instance.orders[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update employee from order' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update employee from order' ]
        ],
        [
          4,
          setup.instance.orders[0].id,
          setup.instance.employees[0].id,
          {},
          [ 'update employee from order' ]
        ]
      ];

      for (let [ id, order_id, employee_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H19-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H19-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H19-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H19-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getEmployee: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H19-05');
    });
    it(`should return status 500 when employee tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: false, updateDepartment: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H19-06');
    });
    it(`should return status 200 when employee is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeeIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove employee', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C08H20-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees[0].id,
          {}
        ],
        [
          2,
          setup.instance.orders[0].id,
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
          setup.instance.orders[0].id,
          setup.instance.employees[0].id,
          { force: 'kndkdkdn' }
        ],
        [
          5,
          setup.instance.orders[0].id,
          setup.instance.employees[0].id,
          { paranoid: 'kndkdkdn' }
        ],
      ];

      for (let [ id, order_id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C08H20-01');
      }
    });
    it(`should return status 500 when order tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H20-02');
    });
    it(`should return status 404 when order was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H20-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H20-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getEmployee: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C08H20-05');
    });
    it(`should return status 500 when employee tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: false, removeEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C08H20-06');
    });
    it(`should return status 200 when employee is removed`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsRemoved({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from order' ];
      let order_id = setup.instance.orders[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${order_id}/employees/${employee_id}`)
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
