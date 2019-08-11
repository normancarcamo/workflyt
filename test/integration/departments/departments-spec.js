const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/departments';
const mocks = require('./departments-mocks');

describe('Department Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/departments/departments-repository');
  });

  // Departments --------------------------------------------------------------

  describe('get departments:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [], {} ],
        [ 2, [ 'dknkndkdn' ], {} ],
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
        setup.assertError(expect, res, 403, 'C05H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments' ];
      let payload = [
        [ 1, { search: null } ],
        [ 2, { include: 'mmmmm' } ]
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
        setup.assertError(expect, res, 400, 'C05H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments' ];
      let options = { name: 'Art' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H01-02');
    });
    it(`should return status 200 when data is filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.departmentsAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get departments' ];
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'Art' } ],
        [ 3, { name: { like: '%tin%' } } ],
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
        expect(res.body.data).toBeArray().not.toBeEmpty();
        expect(res.body.data[0]).toBeObject().not.toBeEmpty();

        if (id === 2) {
          expect(res.body.data[0].name).toEqual('Art');
        } else if (id === 3) {
          expect(res.body.data.some(
            element => element.name === 'Printing'
          )).toBe(true);
        }
      }
    });
  });

  describe('create departments:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kjdnksjndkfjnsd' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'Marketing' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create departments' ];
      let payload = [
        [ 1, { name: '' } ],
        [ 2, { id: 233 } ]
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
        setup.assertError(expect, res, 400, 'C05H02-01');
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
      let permissions = [ 'create departments' ];
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
          setup.assertError(expect, res, 500, 'C05H02-02');
        }
      }
    });
    it(`should return status 200 when department is created`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.departmentIsCreated({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create departments' ];
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

  describe('get Department:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, ['dkndkkdnd'] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.departments[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H03-00');
      }
    });
    it(`should return status 403 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, '11', {} ],
        [ 3, setup.instance.departments[0].id, { id: 'dmdmdm' } ],
      ];

      for (let [ id, department_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${department_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H03-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department' ];
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H03-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department' ];
      let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H03-03');
    });
    it(`should return status 200 when department is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.departmentIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get department' ];
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.name).toEqual(setup.instance.departments[0].name);
    });
  });

  describe('update Department:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdnkdndknd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${department_id}`)
          .send({ name: 'Marketing' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department' ];
      let department_id = setup.instance.departments[0].id;
      let payload = [
        [ 1, { name: '' } ],
        [ 2, { id: 234, name: 'Marketing' } ]
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${department_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H04-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department' ];
      let department_id = setup.instance.departments[0].id;
      let data = { name: 'Department A' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H04-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department' ];
      let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { name: 'Department A' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H04-03');
    });
    it(`should return status 500 when department tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department' ];
      let department_id = setup.instance.departments[0].id;
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H04-04');
    });
    it(`should return status 200 when department was updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.departmentIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update department' ];
      let payload = [
        [ 1, setup.instance.departments[0].id, { name: 'demo' } ]
      ];

      for (let [ id, department_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${department_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
      }
    });
  });

  describe('delete Department:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dknkdnkd' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${setup.instance.departments[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete department' ];
      let payload = [
        [ 1, { force: 'anaaa' } ],
        [ 2, { paranoid: 'naaaa' } ],
        [ 3, { unknownKey: 'naaaa' } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${setup.instance.departments[0].id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H05-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete department' ];
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H05-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete department' ];
      let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H05-03');
    });
    it(`should return status 500 when department tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete department' ];
      let department_id = setup.instance.departments[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H05-04');
    });
    it(`should return status 200 when department is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.departmentIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete department' ];
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
          .delete(`${API_BASE}/${department_id}`)
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

  describe('get employees:', () => {
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
          .get(`${API_BASE}/${setup.instance.departments[0].id}/employees`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from department' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { firstname: 'demo' } ],
        [ 1, setup.instance.departments[0].id, { name: 'demo' } ],
      ];

      for (let [ id, department_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${department_id}/employees`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H06-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from department' ];
      let department_id = setup.instance.departments[0].id;
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H06-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from department' ];
      let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H06-03');
    });
    it(`should return status 500 when employees tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployees: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from department' ];
      let department_id = setup.instance.departments[0].id;
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H06-04');
    });
    it(`should return status 200 when employees are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeesAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from department' ];
      let department = setup.instance.departments.find(
        department => department.name === 'Sales'
      );
      let cases = [
        [ 'A', {} ],
        [ 'B', { firstname: 'Javier' } ],
        [ 'C', { firstname: 'nnnnnnn' } ],
        [ 'D', { firstname: { like: '%nis%' } } ]
      ];

      for (let [ id, options ] of cases) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${department.id}/employees`)
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

  describe('add employees:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let employees = setup.instance.employees.map(e => e.id)[0];
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdndk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${setup.instance.departments[0].id}/employees`)
          .send({ employees })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to department' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          []
        ],
        [
          2,
          setup.instance.departments[0].id,
          []
        ],
        [
          3,
          setup.instance.departments[0].id,
          [ 'dkndkndknd', 'dddmdmdm' ]
        ]
      ];

      for (let [ id, department_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${department_id}/employees`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H07-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to department' ];
      let department_id = setup.instance.departments[0].id;
      let employees = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${department_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H07-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to department' ];
      let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let employees = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${department_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H07-03');
    });
    it(`should return status 500 when employees tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addEmployees: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to department' ];
      let department_id = setup.instance.departments[0].id;
      let employees = setup.instance.employees.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${department_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H07-04');
    });
    it(`should return status 200 when employees has been added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeesAreAdded();
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add employees to department' ];
      let department_id = setup.instance.departments[1].id;
      let employees = setup.instance.employees.slice(0, 2).map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${department_id}/employees`)
        .send({ employees })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get employee:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let department = setup.instance.departments[2];
      let employees = await department.getEmployees({});
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${department.id}/employees/${employees[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H08-00');
      }
    });
    it(`should return stastus 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.employees[0].id
        ],
        [
          2,
          setup.instance.departments[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll'
        ],
        [
          3,
          'dknfkdnkdnfkdn',
          '11bf5b37'
        ],
      ];

      for (let [ id, department_id, employee_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H08-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H08-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let department_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H08-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H08-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      mocks.asNotFound({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H08-05');
    });
    it(`should return status 200 when employee is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeeIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(employee_id);
    });
  });

  describe('update employee', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H09-00');
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
          [ 'update employee from department' ]
        ],
        [
          2,
          setup.instance.departments[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update employee from department' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update employee from department' ]
        ],
        [
          4,
          setup.instance.departments[0].id,
          setup.instance.employees[0].id,
          {},
          [ 'update employee from department' ]
        ]
      ];

      for (let [ id, department_id, employee_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H09-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H09-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H09-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H09-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getEmployee: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H09-05');
    });
    it(`should return status 500 when employee tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: false, updateEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H09-06');
    });
    it(`should return status 200 when employee is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeeIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${department_id}/employees/${employee_id}`)
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
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C05H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.employees[0].id,
          {}
        ],
        [
          2,
          setup.instance.departments[0].id,
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
          setup.instance.departments[0].id,
          setup.instance.employees[0].id,
          { force: 'kndkdkdn' }
        ],
        [
          5,
          setup.instance.departments[0].id,
          setup.instance.employees[0].id,
          { paranoid: 'kndkdkdn' }
        ],
      ];

      for (let [ id, department_id, employee_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C05H10-01');
      }
    });
    it(`should return status 500 when department tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H10-02');
    });
    it(`should return status 404 when department was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H10-03');
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H10-04');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getEmployee: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C05H10-05');
    });
    it(`should return status 500 when employee tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployee: false, removeEmployee: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = setup.instance.departments[0].id;
      let employee_id = setup.instance.employees[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C05H10-06');
    });
    it(`should return status 200 when employee is removed`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.employeeIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove employee from department' ];
      let department_id = setup.instance.departments[0].id;
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
          .delete(`${API_BASE}/${department_id}/employees/${employee_id}`)
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
