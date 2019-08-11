const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/supervisors';
const mocks = require('./supervisors-mocks');

describe('Supervisor Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/supervisors/supervisors-repository');
  });

  describe('get supervisors:', () => {
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
        setup.assertError(expect, res, 403, 'S-SPV-H01-E01');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors' ];
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
        setup.assertError(expect, res, 400, 'S-SPV-H01-E02');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors' ];
      let options = { firstname: 'bbbbb' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'S-SPV-H01-E03');
    });
    it(`should return status 200 when query supervisors are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.supervisorsAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisors' ];
      let payload = [
        [ 1, {} ],
        [ 2, { firstname: 'Javier' } ],
        [ 3, { firstname: { like: '%is%' } } ],
        [ 4, { include: [ 'user' ] } ],
        [ 5, { include: 'user' } ],
        [ 6, { limit: 2 } ],
        [ 7, { offset: 1, limit: 3 } ],
        [ 8, { lastname: 'naaaa' } ],
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
        expect(res.body.data).toBeArray();

        if (id === 1) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 2) {
          expect(res.body.data[0]).toHaveProperty('firstname', 'Javier');
        }
        if (id === 3) {
          expect(res.body.data[0]).toHaveProperty('firstname', 'Denis');
        }
        if (id === 4 || id === 5) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].user).toBeObject();
        }
        if (id === 6) {
          expect(res.body.data).not.toBeEmpty().toHaveLength(2);
        }
        if (id === 7) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 8) {
          expect(res.body.data).toBeEmpty();
        }
      }
    });
  });

  describe('get supervior:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let supervisor_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdndkndknd' ] ],
        [ 3, [ 'kdnkdndkndknd', 'sknksdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${supervisor_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'S-SPV-H02-E01');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor' ];
      let supervisor_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';
      let payload = [
        [ 1, {} ],
        [ 2, { include: 'demo' } ],
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${supervisor_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'S-SPV-H02-E02');
      }
    });
    it(`should return status 500 when supervisor tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor' ];
      let supervisor_id = setup.instance.employees[2].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'S-SPV-H02-E03');
    });
    it(`should return status 404 when supervisor was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor' ];
      let supervisor_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${supervisor_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'S-SPV-H02-E04');
    });
    it(`should return status 200 when supervisor is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.supervisorIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get supervisor' ];
      let supervisor_id = setup.instance.employees[2].id;
      let payload = [
        [ 1, {} ],
        [ 2, { include: 'user' } ],
        [ 3, { include: [ 'user', 'quotes' ] } ],
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${supervisor_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeObject().not.toBeEmpty();
        expect(res.body.data.id).toBe(supervisor_id);

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
          .get(`${API_BASE}/${setup.instance.employees[2].id}/employees`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'S-SPV-H03-E01');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from supervisor' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { firstname: 'demo' } ],
        [ 1, setup.instance.employees[2].id, { unknownKey: 'demo' } ],
      ];

      for (let [ id, supervisor_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${supervisor_id}/employees`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'S-SPV-H03-E02');
      }
    });
    it(`should return status 500 when employee tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from supervisor' ];
      let supervisor_id = setup.instance.employees[2].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${supervisor_id}/employees`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'S-SPV-H03-E03');
    });
    it(`should return status 404 when employee was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from supervisor' ];
      let supervisor_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${supervisor_id}/employees`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'S-SPV-H03-E04');
    });
    it(`should return status 500 when supervisors tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getEmployees: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from supervisor' ];
      let supervisor_id = setup.instance.employees[2].id;
      let options = { firstname: 'demo' };

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${supervisor_id}/employees`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'S-SPV-H03-E05');
    });
    it(`should return status 200 when supervisors are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.employeesAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get employees from supervisor' ];
      let supervisor = setup.instance.employees[3];
      let payload = [
        [ 1, {} ],
        [ 2, { firstname: 'Luis' } ],
        [ 3, { firstname: 'nnnnnnn' } ],
        [ 4, { firstname: { like: '%nilo%' } } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${supervisor.id}/employees`)
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
          expect(res.body.data[0].firstname).toBe('Luis');
        }
        if (id === 3) {
          expect(res.body.data).toBeArray().toBeEmpty();
        }
        if (id === 4) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].firstname).toBe('Danilo');
        }
      }
    });
  });

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
