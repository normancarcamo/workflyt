const supertest = require('supertest');
const setup = require('../index.js').default;
const mocks = require('./permissions-mocks');
const API_BASE = '/v1/permissions';

describe('Permission Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/permissions/permissions-repository');
  });

  describe('get permissions:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkndkdn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C09H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions' ];
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
        setup.assertError(expect, res, 400, 'C09H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions' ];
      let options = { name: 'nnnn' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H01-02');
    });
    it(`should return status 200 when permissions are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionsAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions' ];
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'get category' } ],
        [ 3, { name: { like: '%category%' } } ],
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

        if (id === 1) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
        }

        if (id === 2) {
          expect(res.body.data[0].name).toEqual('get category');
        }

        if (id === 3) {
          res.body.data.map(permission => permission.name)
            .forEach(s => expect(s.includes('category')).toBe(true))
        }
      }
    });
  });

  describe('create permissions:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdnkdnkdnd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'ananana' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C09H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create permissions' ];
      let payload = [
        [ 1, { name: '' } ],
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
        setup.assertError(expect, res, 400, 'C09H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create permissions' ];
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H02-02');
    });
    it(`should return status 200 when permission is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create permissions' ];
      let payload = [
        [ 1, { name: 'demo 1' } ],
        [ 2, { name: 'demo 2', created_by: setup.instance.users[0].id } ]
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
        if (id === 1) {
          expect(res.body.data.created_by).toBe(null);
        } else {
          expect(res.body.data.created_by).toBe(setup.instance.users[0].id);
        }
      }
    });
  });

  describe('get Permission:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'skdnkdnkdnd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.permissions[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C09H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, '11bf5', {} ],
        [ 3, setup.instance.permissions[0].id, { attributes: 'anaaa' } ]
      ];

      for (let [ id, permission_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${permission_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C09H03-01');
      }
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission' ];
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H03-02');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission' ];
      let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C09H03-03');
    });
    it(`should return status 200 when permission is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission' ];
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data.id).toBe(permission_id);
    });
  });

  describe('update Permission:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permission_id = setup.instance.permissions[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kndkdndkdn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${permission_id}`)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C09H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission' ];
      let permission_id = setup.instance.permissions[0].id;
      let payload = [
        [ 1, { id: 2443 } ],
        [ 2, { name: '' } ],
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${permission_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C09H04-01');
      }
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission' ];
      let permission_id = setup.instance.permissions[0].id;
      let data = { name: 'Permission A' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H04-02');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission' ];
      let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { name: 'Permission A' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C09H04-03');
    });
    it(`should return status 500 when permission tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission' ];
      let permission_id = setup.instance.permissions[0].id;
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H04-04');
    });
    it(`should return status 200 when permission is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.permissions[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete Permission:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkndknd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${setup.instance.permissions[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions: [] })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C09H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete permission' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.permissions[0].id, { attributes: 'sknsksnk' } ],
      ];

      for (let [ id, permission_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${permission_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C09H05-01');
      }
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete permission' ];
      let permission_id = setup.instance.permissions[0].id;
      let options = {};

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${permission_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H05-02');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete permission' ];
      let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = {};

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${permission_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C09H05-03');
    });
    it(`should return status 500 when permission tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete permission' ];

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${setup.instance.permissions[0].id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C09H05-04');
    });
    it(`should return status 200 when permission has been deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permission_id = setup.instance.permissions[0].id;
      let permissions = [ 'delete permission' ];
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
          .delete(`${API_BASE}/${permission_id}`)
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
