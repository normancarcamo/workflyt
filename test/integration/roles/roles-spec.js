const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/roles';
const mocks = require('./roles-mocks');

describe('Role Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/roles/roles-repository');
  });

  // Roles --------------------------------------------------------------------

  describe('get roles:', () => {
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
        setup.assertError(expect, res, 403, 'C11H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles' ];
      let options = { name: 'abcdefghijklmnopqrstuvwxyz1234567890' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 400, 'C11H01-01');
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles' ];
      let options = { name: 'steel' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H01-02');
    });
    it(`should return status 200 when roles were filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.rolesAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles' ];
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'Tester' } ],
        [ 3, { name: { like: '%min%' } } ],
        [ 4, { name: 'Admin', include: 'permissions' } ],
        [ 5, { name: 'Admin', include: [ 'permissions' ] } ],
        [ 6, { name: 'Admin', attributes: 'id,code,name' } ],
        [ 7, { name: 'Admin', attributes: [ 'id', 'code', 'name' ] } ],
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
          expect(res.body.data[0]).toHaveProperty('name', 'Tester');
        }

        if (id === 3) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Admin');
        }

        if ([4,5].includes(id)) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'Admin');
          expect(res.body.data[0].permissions).toBeArray().not.toBeEmpty();
        }

        if ([6,7].includes(id)) {
          expect(res.body.data).toBeArray().not.toBeEmpty();
          let role = setup.instance.roles[1];
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
          expect(res.body.data[0]).toHaveProperty('name', 'Tester');
        }
      }
    });
  });

  describe('create roles:', () => {
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
        setup.assertError(expect, res, 403, 'C11H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create roles' ];
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
        setup.assertError(expect, res, 400, 'C11H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ create: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create roles' ];
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H02-02');
    });
    it(`should return status 200 when role is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create roles' ];
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

  describe('get role:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdkdnkdndkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd',
          {}
        ],
        [
          2,
          setup.instance.roles[0].id,
          { attributes: 'sssmsm' }
        ]
      ];

      for (let [ id, role_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H03-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role' ];
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H03-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role' ];
      let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H03-03');
    });
    it(`should return status 200 when role is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role' ];
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject();
      expect(res.body.data).toContainAnyKeys(Object.keys(
        setup.instance.roles[0].dataValues
      ));
      expect(res.body.data.id).toBe(role_id);
      expect(res.body.data.name).toBeString();
      expect(res.body.data.name).not.toBeEmpty();
      expect(res.body.data.deleted_at).toBe(null);
    });
  });

  describe('update role:', () => {
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
          .put(`${API_BASE}/${setup.instance.roles[0].id}`)
          .send({ name: 'demo' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role' ];
      let payload = [
        { id: 234 },
        { name: '' },
      ];

      for (let data of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.roles[0].id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H04-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.roles[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H04-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role' ];
      let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H04-03');
    });
    it(`should return status 500 when role tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role' ];

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.roles[0].id}`)
        .send({ name: 'name' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H04-04');
    });
    it(`should return status 200 when role was updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role' ];
      let oldName = setup.instance.roles[0].name;

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${setup.instance.roles[0].id}`)
        .send({ name: 'demo' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject();
      expect(res.body.data.name).not.toBe(oldName);
      expect(res.body.data.name).toBe('demo');
      expect(res.body.data.updated_at).not.toBe(null);
    });
  });

  describe('delete role:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdkdmkdkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${role_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete role' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.roles[0].id, { force:'nanana' } ]
      ];

      for (let [ id, role_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .del(`${API_BASE}/${role_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H05-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete role' ];
      let role_id = setup.instance.roles[0].id;
      let options = {};

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${role_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H05-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete role' ];
      let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H05-03');
    });
    it(`should return status 500 when role tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete role' ];
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .del(`${API_BASE}/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H05-04');
    });
    it(`should return status 200 when role was deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete role' ];
      let role_id = setup.instance.roles[0].id;
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
          .del(`${API_BASE}/${role_id}`)
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

  // Permissions --------------------------------------------------------------

  describe('get permissions', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}/permissions`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H06-00');
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
          [ 'get permissions from role' ]
        ],
        [
          2,
          setup.instance.roles[0].id,
          { limit: 'ww' },
          [ 'get permissions from role' ]
        ]
      ];

      for (let [ id, role_id, options, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}/permissions`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H06-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions from role' ];
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H06-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions from role' ];
      let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H06-03');
    });
    it(`should return status 500 when permissions tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermissions: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions from role' ];
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H06-04');
    });
    it(`should return status 200 when permissions are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionsAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permissions from role' ];
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { name: 'get roles' } ],
        [ 3, { name: { like: '%roles%' } } ],
        [ 4, { limit: 2 } ],
        [ 5, { offset: 1, limit: 1 } ],
        [ 6, { limit: 1, attributes: 'id,code,name' } ],
        [ 7, { limit: 1, attributes: [ 'id', 'code', 'name' ] } ],
        [ 8, { name: 'sksksksm' } ],
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}/permissions`)
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
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toHaveProperty('name', 'get roles');
        }
        if ([3].includes(id)) {
          for (let element of res.body.data) {
            expect(element.name).toContain('roles')
          }
        }
        if ([4].includes(id)) {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[1]).toBeObject().not.toBeEmpty();
        }
        if ([5].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
        }
        if ([6,7].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0]).toContainAllKeys([
            'id', 'code', 'name', 'RolePermission'
          ]);
        }
        if ([8].includes(id)) {
          expect(res.body.data).toBeEmpty();
        }
      }
    });
  });

  describe('add permissions', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let data = setup.instance.permissions.slice(0, 10).map(dep => dep.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${role_id}/permissions`)
          .send({ permissions: data })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.permissions.slice(0, 3).map(dep => dep.id),
          [ 'add permissions to role' ]
        ],
        [
          2,
          setup.instance.roles[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add permissions to role' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ],
          [ 'add permissions to role' ]
        ],
      ];

      for (let [ id, role_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${role_id}/permissions`)
          .send({ permissions: data })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H07-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add permissions to role' ];
      let role_id = setup.instance.roles[0].id;
      let data = setup.instance.permissions.slice(0, 3).map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${role_id}/permissions`)
        .send({ permissions: data })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H07-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add permissions to role' ];
      let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = setup.instance.permissions.slice(0, 4).map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${role_id}/permissions`)
        .send({ permissions: data })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H07-03');
    });
    it(`should return status 500 when permissions tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addPermissions: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add permissions to role' ];
      let role_id = setup.instance.roles[0].id;
      let data = setup.instance.permissions.slice(0, 3).map(dep => dep.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${role_id}/permissions`)
        .send({ permissions: data })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H07-04');
    });
    it(`should return status 200 when permissions are added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionsAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add permissions to role' ];
      let role_id = setup.instance.roles[1].id;
      let data = setup.instance.permissions.slice(0, 2).map(d => d.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${role_id}/permissions`)
        .send({ permissions: data })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get permission', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.permissions[0].id,
          [ 'get permission from role' ]
        ],
        [
          2,
          setup.instance.roles[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          [ 'get permission from role' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ 'get permission from role' ]
        ]
      ];

      for (let [ id, role_id, permission_id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H08-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H08-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission from role' ];
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H08-03');
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermission: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H08-04');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getPermission: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67c';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H08-05');
    });
    it(`should return status 200 when permission is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('update permission', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H09-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.permissions[0].id,
          { extra: { units: 20 } },
          [ 'update permission from role' ]
        ],
        [
          2,
          setup.instance.roles[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update permission from role' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update permission from role' ]
        ],
        [
          4,
          setup.instance.roles[0].id,
          setup.instance.permissions[0].id,
          {},
          [ 'update permission from role' ]
        ]
      ];

      for (let [ id, role_id, permission_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H09-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H09-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let permission_id = setup.instance.permissions[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H09-03');
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermission: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H09-04');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getPermission: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H09-05');
    });
    it(`should return status 500 when permission tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermission: false, updatePermission: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H09-06');
    });
    it(`should return status 200 when permission is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update permission from role' ];
      let role = setup.instance.roles[0];
      let role_id = role.id;
      let _permissions = await role.getPermissions({});
      let permission_id = _permissions[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove permission', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C11H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.permissions[0].id,
          {}
        ],
        [
          2,
          setup.instance.roles[0].id,
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
          setup.instance.roles[0].id,
          setup.instance.permissions[0].id,
          { force: 'kndkdkdn' }
        ],
        [
          5,
          setup.instance.roles[0].id,
          setup.instance.permissions[0].id,
          { paranoid: 'kndkdkdn' }
        ],
      ];

      for (let [ id, role_id, permission_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C11H10-01');
      }
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H10-02');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H10-03');
    });
    it(`should return status 500 when permission tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermission: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H10-04');
    });
    it(`should return status 404 when permission was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getPermission: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C11H10-05');
    });
    it(`should return status 500 when permission tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getPermission: false, removePermission: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role_id = setup.instance.roles[0].id;
      let permission_id = setup.instance.permissions[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C11H10-06');
    });
    it(`should return status 200 when permission is removed`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.permissionIsRemoved({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove permission from role' ];
      let role = setup.instance.roles[0];
      let role_id = role.id;
      let _permissions = await role.getPermissions({});
      let permission_id = _permissions[0].id;
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
          .delete(`${API_BASE}/${role_id}/permissions/${permission_id}`)
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
