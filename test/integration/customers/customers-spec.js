const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/customers';
const mocks = require('./customers-mocks');

describe('Customer Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/customers/customers-repository');
  });

  // Customers ----------------------------------------------------------------

  describe('get customers:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkmdkmd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customers' ];
      let payload = [
        [ 1, { search: null } ],
        [ 2, { include: 'smsms' } ]
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
        setup.assertError(expect, res, 400, 'C04H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customers' ];
      let options = { name: 'bbbbb' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H01-02');
    });
    it(`should return status 200 when customers are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.customersAreFiltered({ cycle, setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customers' ];
      let payload = [
        [ 1, { } ],
        [ 2, { name: 'Jetstereo' } ],
        [ 3, { name: { like: '%tereo%' } } ]
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

        if (id === 1) {
          expect(res.body.data).toBeArray().not.toBeEmpty().toHaveLength(3);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Jetstereo');
          expect(res.body.data[1]).toBeObject().not.toBeEmpty();
          expect(res.body.data[1].name).toBe('Bac credomátic');
          expect(res.body.data[2]).toBeObject().not.toBeEmpty();
          expect(res.body.data[2].name).toBe('Claro');
        } else if (id === 2) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Jetstereo');
        } else if (id === 3) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Jetstereo');
        } else {
          expect(res.body.data).toBeArray().toBeEmpty();
        }
      }
    });
  });

  describe('create customers:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkmdkmd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create customers' ];
      let payload = [
        [ 1, { name: '' } ],
        [ 2, { id: 3435345 } ],
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
        setup.assertError(expect, res, 400, 'C04H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.createRepeatedError({ cycle, setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create customers' ];
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
          setup.assertError(expect, res, 500, 'C04H02-02');
        }
      }
    });
    it(`should return status 201 when customers is created`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.customerIsCreated({ setup, cycle })
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create customers' ];
      let payload = [
        [ 1, { name: 'demo' } ],
        [ 2, { name: 'anonym', created_by: setup.instance.users[0].id } ]
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
        setup.assertOk(expect, res, 201);

        if (id === 1) {
          expect(res.body.data.created_by).toBe(null);
          expect(res.body.data.name).toBe('demo');
        }

        if (id === 2) {
          expect(res.body.data.name).toBe('anonym');
          expect(res.body.data.created_by).toBe(setup.instance.users[0].id);
        }
      }
    });
  });

  describe('get Customer:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, setup.instance.customers[0].id, [] ],
        [ 2, setup.instance.customers[0].id, [ 'kdnkdnkdndkn' ] ],
      ];

      for (let [ id, customer_id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customer' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, setup.instance.customers[0].id, { include: 'naaaa' } ]
      ];

      for (let [ id, customer_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H03-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customer' ];
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H03-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customer' ];
      let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H03-03');
    });
    it(`should return status 200 when customer is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.customerIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get customer' ];
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toEqual(customer_id);
    });
  });

  describe('update Customer:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let customer_id = setup.instance.customers[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdkdnkndkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${customer_id}`)
          .send({ name: 'anything' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update customer' ];
      let customer_id = setup.instance.customers[0].id;
      let payload = [
        [ 1, { id: 23 } ],
        [ 2, { name: '' } ]
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${customer_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H04-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update customer' ];
      let data = { name: 'demo' };
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${customer_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H04-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update customer' ];
      let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${customer_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H04-03');
    });
    it(`should return status 500 when customer tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update customer' ];
      let customer_id = setup.instance.customers[0].id;
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${customer_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H04-04');
    });
    it(`should return status 200 when customer is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.customerIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update customer' ];
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${customer_id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete Customer:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let customer_id = setup.instance.customers[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdkdnkndkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${customer_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete customer' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-', {} ],
        [ 2, setup.instance.customers[0].id, { force: 'naaa' } ],
        [ 3, setup.instance.customers[0].id, { force: '' } ],
        [ 4, setup.instance.customers[0].id, { paranoid: 'dddd' } ],
        [ 5, setup.instance.customers[0].id, { paranoid: '' } ]
      ];

      for (let [ id, customer_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${customer_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H05-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete customer' ];
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H05-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete customer' ];
      let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H05-03');
    });
    it(`should return status 500 when customer tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete customer' ];
      let customer_id = setup.instance.customers[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${customer_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H05-04');
    });
    it(`should return status 200 when customer is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.customerIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete customer' ];
      let customer_id = setup.instance.customers[0].id;
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
          .delete(`${API_BASE}/${customer_id}`)
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

  // Quotes -------------------------------------------------------------------

  describe('get quotes:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let customer_id = setup.instance.customers[0].id;
      let options = { subject: 'demo' };
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdmkdmkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}/quotes`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from customer' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { subject: 'demo' } ],
        [ 2, setup.instance.customers[0].id, { unknownKey: 'demo' } ],
      ];

      for (let [ id, customer_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}/quotes`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H06-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from customer' ];
      let customer_id = setup.instance.customers[0].id;
      let options = { subject: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H06-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from customer' ];
      let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { subject: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H06-03');
    });
    it(`should return status 500 when quotes tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getQuotes: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from customer' ];
      let customer_id = setup.instance.customers[0].id;
      let options = { subject: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H06-04');
    });
    it(`should return status 200 when quotes are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.quotesAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from customer' ];
      let customer = setup.instance.customers[2];
      let payload = [
        [ 'A', {} ],
        [ 'B', { subject: 'Banner wall 129.23 x 32' } ],
        [ 'C', { subject: 'ddd x 32' } ],
        [ 'D', { subject: { like: '%door%' } } ],
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer.id}/quotes`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);

        if (id === 'A') {
          expect(res.body.data).toBeArray().not.toBeEmpty();
        }
        if (id === 'B') {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].subject).toBe(
            'Banner wall 129.23 x 32'
          );
        }
        if (id === 'C') {
          expect(res.body.data).toBeArray().toBeEmpty();
        }
        if (id === 'D') {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].subject).toBe(
            'Banner door 23x3'
          );
        }
      }
    });
  });

  describe('add quotes:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let customer_id = setup.instance.customers[2].id;
      let quotes = setup.instance.quotes.map(e => e.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdnkdnkdn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${customer_id}/quotes`)
          .send({ quotes })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to customer' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.quotes.map(e => e.id)
        ],
        [
          2,
          setup.instance.customers[0].id,
          []
        ],
        [
          3,
          setup.instance.customers[0].id,
          [ 'ddkdnkdndkdnkdn' ]
        ],
      ];

      for (let [ id, customer_id, quotes ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${customer_id}/quotes`)
          .send({ quotes })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H07-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${customer_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H07-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to customer' ];
      let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${customer_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H07-03');
    });
    it(`should return status 500 when quotes tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addQuotes: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${customer_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H07-04');
    });
    it(`should return status 201 when quotes are added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quotesAreAdded();
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quotes = setup.instance.quotes.map(q => q.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${customer_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get quote:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let customer_id = setup.instance.customers[0].id;
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skksnsknsk' ] ],
      ];

      for (let [ id, permissions] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C04H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.quotes[0].id,
          {}
        ],
        [
          2,
          setup.instance.customers[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllslll',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          4,
          setup.instance.quotes[0].id,
          setup.instance.customers[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, customer_id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C04H08-01');
      }
    });
    it(`should return status 500 when customer tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H08-02');
    });
    it(`should return status 404 when customer was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let customer_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H08-03');
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getQuote: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C04H08-04');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: false, getQuote: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let customer_id = setup.instance.customers[0].id;
      let quote_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C04H08-05');
    });
    it(`should return status 200 when quote is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from customer' ];
      let customer = setup.instance.customers[0];
      let quotes = await customer.getQuotes({});
      let quote_id = quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${customer.id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toBe(quote_id);
      expect(res.body.data.customer_id).toBe(customer.id);
    });
  });

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
