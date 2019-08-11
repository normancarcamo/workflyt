const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/employees';
const mocks = require('./employees-mocks');

describe('Employee Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/employees/employees-repository');
  });

  // Employees ----------------------------------------------------------------

  describe('get employees:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, ['kdnkdfnkdfnkdf'] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees' ];
      let payload = [
        [ 1, { unknownKey: 'ddmdm' } ],
        [ 2, { id: 'ddmdm' } ],
        [ 3, { include: 'ddddd' } ], // inexistent association
      ]

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees' ];
      let options = { firstname: 'bbbbb' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H01-02');
    });
    it(`should return status 200 when query finished`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeesAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees' ];
      let payload = [
        [ 1, {} ],
        [ 2, { firstname: 'Luis' } ],
        [ 3, { firstname: { like: '%is%' } } ],
        [ 4, { include: [ 'user' ] } ],
        [ 5, { include: 'user' } ],
        [ 6, { limit: 2 } ],
        [ 7, { offset: 2, limit: 3 } ],
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
        // Pending assertions...
      }
    });
  });

  describe('create employee:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, ['kdjsnkjnksjndf'] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ firstname: 'Jonh', lastname: 'Doe' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create employees' ];
      let payload = [
        [ 1, {} ],
        [ 2, { firstname: '', lastname: '' } ],
        [ 3, { firstname: 'sFngng', lastname: '' } ],
        [ 4, { firstname: '', lastname: 'dfsdkn' } ]
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
        setup.assertError(expect, res, 400, 'C06H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.createRepeatedError({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create employees' ];
      let payload = [
        [ 1, { firstname: 'demo', lastname: 'demo2' } ],
        [ 2, { firstname: 'demo', lastname: 'demo2' } ],
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
          setup.assertError(expect, res, 500, 'C06H02-02');
        }
      }
    });
    it(`should return status 200 when is created`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsCreated({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create employees' ];
      let payload = [
        [ 1, {
          firstname: 'Steve',
          lastname: 'Knoxville'
        } ],
        [ 2, {
          firstname: 'Steve',
          lastname: 'Tow',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
        } ],
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
        expect(res.body.data.firstname).toBe('Steve');
        expect(res.body.data.lastname).toBe(
          id === 1 ? 'Knoxville' : 'Tow'
        );
        expect(res.body.data.created_by).toBe(
          id === 1 ? null : setup.instance.users[0].id
        );
        expect(res.body.data.updated_by).toBe(
          id === 1 ? null : setup.instance.users[0].id
        );
      }
    });
  });

  describe('get employee:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdndkndknd' ] ],
        [ 3, [ 'kdnkdndkndknd', 'sknksdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';
      let payload = [
        [ 1, {} ],
        [ 2, { include: 'demo' } ],
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H03-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H03-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H03-03');
    });
    it(`should return status 200 when is found`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsFound({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee' ];
      let employee_id = setup.instance.employees[2].id;
      let payload = [
        [ 1, {} ],
        [ 2, { include: 'user' } ],
        [ 3, { include: [ 'user', 'quotes' ] } ],
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data.id).toBe(employee_id);

        if (!setup.is_mocked) {
          if (id === 1) {
            expect(res.body.data.user).not.toBeDefined();
            expect(res.body.data.quotes).not.toBeDefined();
          } else if (id === 2) {
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.quotes).not.toBeDefined();
          } else if (id === 3) {
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.quotes).toBeDefined();
          }
        }
      }
    });
  });

  describe('update employee:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112';
      let data = { id: 12 };
      let payload = [
        [ 1, [] ],
        [ 2, [ 'Any other permission' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${employee_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112';
      let payload = [
        [ 1, {} ],
        [ 2, { id: 12 } ],
        [ 3, { id: null } ],
        [ 4, { id: true } ],
        [ 5, { firstname: 'kdnkdfn', lastname: null } ],
        [ 6, { lastname: true } ],
        [ 7, { unknownKey: 'naaa' } ],
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${employee_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H04-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee' ];
      let employee_id = setup.instance.employees[0].id;
      let data = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H04-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H04-03');
    });
    it(`should return status 500 when employee tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee' ];
      let employee_id = setup.instance.employees[0].id;
      let data = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H04-04');
    });
    it(`should return status 200 when is updated`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsUpdated({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee' ];
      let employee = setup.instance.employees[0];
      let payload = [
        [ 1, { firstname: 'dominic' } ],
        [ 2, { firstname: 'naaa' } ],
        [ 3, { lastname: 'dan' } ],
        [ 4, { lastname: 'neee' } ],
      ];

      for (let [ id, data ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${employee.id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
      }
    });
  });

  describe('delete employee:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'Do any other thing' ] ],
      ];

      for (let [ id, permissions ] of payload) {

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete employee' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, '---', {} ],
        [ 3, '11bf5b37', {} ],
        [ 4, '--11bf5b37-', {} ],
        // this one throws 405 because the endpoint becomes APIBASE/
        // and there's no an action defined with 'delete' method.
        // [ ?, '-', {} ],
        [ 5, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { force: '' } ],
        [ 6, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { force: 3 } ],
        [ 7, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { force: 'aaaa' } ],
        [ 8, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { force: undefined } ],
        [ 9, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { paranoid: 'aaaa' } ],
        [ 10, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { paranoid: 5 } ],
        [ 11, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc1112', { paranoid: null } ],
      ];

      for (let [ id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H05-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H05-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H05-03');
    });
    it(`should return status 500 when employee tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H05-04');
    });
    it(`should return status 200 when is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete employee' ];
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
          .delete(`${API_BASE}/${employee_id}`)
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

  // Users ----- ---------------------------------------------------------------

  describe('get user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, ['dknkdfnkdfn'] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/user`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user from employee' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll', {} ],
        [ 2, '1kdfn', {} ],
        [ 3, setup.instance.employees[0].id, { include: 'naaaaaa' } ]
      ];

      for (let [ id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/user`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H06-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H06-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user from employee' ];
      let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H06-03');
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getUser: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H06-04');
    });
    it(`should return status 200 when user is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = await setup.instance.employees[0].getUser();

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toBe(user.id);
    });
  });

  describe('set user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = setup.instance.users[0].id;
      let user = setup.instance.users[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkdnkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${employee_id}/user`)
          .send({ user })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let payload = [
        [ 1, setup.instance.employees[0].id, {} ],
        [
          2,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          { user: setup.instance.users[0].id }
        ],
        [
          3,
          setup.instance.employees[0].id,
          { user: 'dsfdkfndkfnkfnkdf' }
        ]
      ];

      for (let [ id, employee_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${employee_id}/user`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H07-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H07-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';
      let user = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H07-03');
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      // if (setup.is_mocked) {
        // jest.spyOn(setup.models.Employee, 'findByPk').mockImplementation(
        //   async (id, options) => setup.instance.users[0]
        // );
      // }
      mocks.asError({ findByPk: false, getUser: true });

      // jest.spyOn(setup.models.User, 'findByPk').mockImplementation(
      //   async (id, options) => {
      //     throw new Error('user not found in db.');
      //   }
      // );

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H07-04');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getUser: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = '19734cd8-cbb9-4017-a6df-33a97872953e';

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H07-05');
    });
    it(`should return status 500 when user tried to be set`, async () => {
      // Setup:
      // if (setup.is_mocked) {
      //   jest.spyOn(setup.models.User, 'findByPk').mockImplementation(
      //     async (id, options) => setup.instance.users[0]
      //   );
      // }

      // jest.spyOn(setup.models.Employee, 'findByPk').mockImplementation(
      //   async (id, options) => ({
      //     setUser: async payload => {
      //       throw new Error('error mocked.');
      //     }
      //   })
      // );
      mocks.asError({ findByPk: false, getUser: false, setUser: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H07-06');
    });
    it(`should return status 200 when user is set`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsSet({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'set user to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let user = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/user`)
        .send({ user })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkndkdnk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}/user`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove user from employee' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll' ],
        [ 2, '11bf5b37' ]
      ];

      for (let [ id, employee_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}/user`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H08-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove user from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H08-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove user from employee' ];
      let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H08-03');
    });
    it(`should return status 500 when user tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getUser: false, removeUser: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove user from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H08-04');
    });
    it(`should return status 200 when user is removed`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsRemoved({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove user from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/user`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  // Quotes -------------------------------------------------------------------

  describe('get quotes:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let payload = [
        [ 1, [], { subject: 'demo' } ],
        [ 2, [ 'knfkdnfkdf' ], { subject: 'demo' } ],
      ];

      for (let [ id, permissions, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/quotes`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H09-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from employee' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { subject: 'demo' } ],
        [ 2, setup.instance.employees[0].id, { dmdmdm: 'demo' } ],
      ]

      for (let [ id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/quotes`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H09-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let options = { subject: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H09-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { subject: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H09-03');
    });
    it(`should return status 500 when quotes tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getQuotes: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let options = { subject: 'demodd' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H09-04');
    });
    it(`should return status 200 when quotes are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.quotesAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quotes from employee' ];
      let employee = setup.instance.employees[2];
      let cases = [
        [ 'A', {} ],
        [ 'B', { subject: 'Stickers for furniture 2x24' } ],
        [ 'C', { subject: 'nnnnnnn' } ],
        [ 'D', { subject: { like: '%cker%' } } ]
      ];

      for (let [ id, options ] of cases) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee.id}/quotes`)
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
            'Stickers for furniture 2x24'
          );
        }
        if (id === 'C') {
          expect(res.body.data).toBeArray().toBeEmpty();
        }
        if (id === 'D') {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].subject).toBe(
            'Stickers for furniture 2x24'
          );
        }
      }
    });
  });

  describe('add quotes:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
      let quotes = setup.instance.quotes.map(e => e.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dknkdnkdn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${employee_id}/quotes`)
          .send({ quotes })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to employee' ];
      let quotes = setup.instance.quotes.map(e => e.id);
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { quotes } ],
        [ 2, '11b', { quotes } ],
        [ 3, setup.instance.employees[0].id, { quotes: [] } ],
        [ 4, setup.instance.employees[0].id, { quotes: [ 'dmndn' ] } ]
      ];

      for (let [ id, employee_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${employee_id}/quotes`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H10-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H10-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H10-03');
    });
    it(`should return status 500 when quotes tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addQuotes: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quotes = setup.instance.quotes.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/quotes`)
        .send({ quotes })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H10-04');
    });
    it(`should return status 200 when quotes are added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quotesAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add quotes to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quotes = setup.instance.quotes.map(q => q.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/quotes`)
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
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
      let quote_id = setup.instance.quotes[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'sksknskksnn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H11-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.quotes[0].id,
          {}
        ],
        [
          2,
          setup.instance.employees[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ]
      ];

      for (let [ id, employee_id, quote_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H11-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H11-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let employee_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H11-03');
    });
    it(`should return status 500 when quote tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getQuote: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quote_id = setup.instance.quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H11-04');
    });
    it(`should return status 404 when quote was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: false, getQuote: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let quote_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H11-05');
    });
    it(`should return status 200 when quote is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.quoteIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get quote from employee' ];
      let employee_id = setup.instance.employees[2].id;
      let quotes = await setup.instance.employees[2].getQuotes({});
      let quote_id = quotes[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/quotes/${quote_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toBe(quote_id);
    });
  });

  // Supervisors --------------------------------------------------------------

  describe('get supervisors:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kndkdnk' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.employees[0].id}/supervisors`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H12-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors from employee' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { firstname: 'demo' } ],
        [ 1, setup.instance.employees[0].id, { name: 'demo' } ],
      ];

      for (let [ id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/supervisors`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H12-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors from employee' ];
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H12-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors from employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H12-03');
    });
    it(`should return status 500 when supervisors tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getSupervisors: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H12-04');
    });
    it(`should return status 200 when supervisors are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };
      if (setup.is_mocked) {
        mocks.supervisorsAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors from employee' ];
      let employee = setup.instance.employees[0];
      let payload = [
        [ 'A', {} ],
        [ 'B', { firstname: 'Javier' } ],
        [ 'C', { firstname: 'nnnnnnn' } ],
        [ 'D', { firstname: { like: '%nis%' } } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee.id}/supervisors`)
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
          expect(res.body.data[0].firstname).toBe(
            'Javier'
          );
        }
        if (id === 'C') {
          expect(res.body.data).toBeArray().toBeEmpty();
        }
        if (id === 'D') {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].firstname).toBe(
            'Denis'
          );
        }
      }
    });
  });

  describe('add supervisors:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let supervisors = setup.instance.employees.map(e => e.id)[0];
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdndk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${setup.instance.employees[0].id}/supervisors`)
          .send({ supervisors })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H13-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add supervisors to employee' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          []
        ],
        [
          2,
          setup.instance.employees[0].id,
          []
        ],
        [
          3,
          setup.instance.employees[0].id,
          [ 'dkndkndknd', 'dddmdmdm' ]
        ]
      ];

      for (let [ id, employee_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${employee_id}/supervisors`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H13-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add supervisors to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisors = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/supervisors`)
        .send({ supervisors })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H13-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add supervisors to employee' ];
      let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let supervisors = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/supervisors`)
        .send({ supervisors })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H13-03');
    });
    it(`should return status 500 when supervisors tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addSupervisors: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add supervisors to employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisors = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee_id}/supervisors`)
        .send({ supervisors })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H13-04');
    });
    it(`should return status 200 when supervisors has been added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.supervisorsAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add supervisors to employee' ];
      let employee = setup.instance.employees.find(
        employee => employee.firstname.includes('Erick')
      );
      let supervisors = [
        setup.instance.employees
          .find(supervisor => supervisor.firstname.includes('Javier')).id,
        setup.instance.employees
          .find(supervisor => supervisor.firstname.includes('Denis')).id
      ];

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${employee.id}/supervisors`)
        .send({ supervisors })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get supervisor:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee = setup.instance.employees[0];
      let supervisors = await employee.getSupervisors({});
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee.id}/supervisors/${supervisors[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H14-00');
      }
    });
    it(`should return stastus 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.employees[0].id,
          {}
        ],
        [
          2,
          setup.instance.employees[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflll',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          4,
          'dknfkdnkdnfkdn',
          '11bf5b37',
          {}
        ],
        [
          5,
          setup.instance.employees[0].id,
          setup.instance.employees[2].id,
          { paranoid: 'ksnsknsks' }
        ],
        [
          6,
          setup.instance.employees[0].id,
          setup.instance.employees[2].id,
          { unknownKey: 'ksnsknsks' }
        ],
        [
          7,
          setup.instance.employees[0].id,
          setup.instance.employees[2].id,
          { attributes: 'knana' }
        ],
      ];

      for (let [ id, employee_id, supervisor_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H14-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[2].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H14-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let employee_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H14-03');
    });
    it(`should return status 500 when supervisor tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getSupervisor: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H14-04');
    });
    it(`should return status 404 when supervisor was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getSupervisor: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H14-05');
    });
    it(`should return status 200 when supervisor is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.supervisorIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor from employee' ];
      let employee_id = setup.instance.employees
        .find(employee => employee.firstname === 'Luis').id;
      let supervisor_id = setup.instance.employees
        .find(supervisor => supervisor.firstname === 'Denis').id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toBe(supervisor_id);
      expect(res.body.data.firstname).toBe('Denis');
    });
  });

  describe('update supervisor', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H15-00');
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
          [ 'update supervisor from employee' ]
        ],
        [
          2,
          setup.instance.employees[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update supervisor from employee' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update supervisor from employee' ]
        ],
        [
          4,
          setup.instance.employees[0].id,
          setup.instance.employees[0].id,
          {},
          [ 'update supervisor from employee' ]
        ]
      ];

      for (let [ id, employee_id, supervisor_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H15-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H15-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let supervisor_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H15-03');
    });
    it(`should return status 500 when supervisor tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getSupervisor: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H15-04');
    });
    it(`should return status 404 when supervisor was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getSupervisor: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H15-05');
    });
    it(`should return status 500 when supervisor tried to be updated`, async () => {
      // Setup:
      mocks.asError({
        findByPk: false,
        getSupervisor: false,
        updateSupervisor: true
      });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H15-06');
    });
    it(`should return status 200 when supervisor is updated`, async () => {
      if (setup.is_mocked) {
        mocks.supervisorIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[2].id;
      let data = { extra: { is_active: true } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove supervisor', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C06H16-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees[0].id,
          {}
        ],
        [
          2,
          setup.instance.employees[0].id,
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
          setup.instance.employees[0].id,
          setup.instance.employees[0].id,
          { force: 'kndkdkdn' }
        ],
        [
          5,
          setup.instance.employees[0].id,
          setup.instance.employees[0].id,
          { paranoid: 'kndkdkdn' }
        ],
      ];

      for (let [ id, employee_id, supervisor_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C06H16-01');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H16-02');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H16-03');
    });
    it(`should return status 500 when supervisor tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getSupervisor: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H16-04');
    });
    it(`should return status 404 when supervisor was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getSupervisor: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C06H16-05');
    });
    it(`should return status 500 when supervisor tried to be removed`, async () => {
      // Setup:
      mocks.asError({
        findByPk: false,
        getSupervisor: false,
        removeSupervisor: true
      });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C06H16-06');
    });
    it(`should return status 200 when supervisor is removed`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.supervisorIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove supervisor from employee' ];
      let employee_id = setup.instance.employees[0].id;
      let supervisor_id = setup.instance.employees[2].id;
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
          .delete(`${API_BASE}/${employee_id}/supervisors/${supervisor_id}`)
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
