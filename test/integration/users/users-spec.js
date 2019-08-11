const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/users';
const mocks = require('./users-mocks');

describe('User Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('bcrypt');
    jest.unmock('src/core/users/users-repository');
  });

  // Users --------------------------------------------------------------------

  describe('get users:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdn' ] ],
      ];
      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get users' ];
      let payload = [
        [ 1, { unknownKey: 'dkndkdnkd' } ],
        [ 2, { paranoid: 'naaaa' } ],
        [ 3, { limit: 'neeee' } ],
        [ 4, { offset: 'nnrrr' } ],
        [ 5, { include: 'employees' } ],
        [ 6, { include: [ 'role' ] } ],
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
        setup.assertError(expect, res, 400, 'C14H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get users' ];
      let options = { username: 'bngsssss' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H01-02');
    });
    it(`should return status 200 when users are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.usersAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get users' ];
      let payload = [
        [ 1, {} ],
        [ 2, { username: 'lberrios' } ],
        [ 3, { username: { like: '%bri%' } } ],
        [ 4, { limit: 2 } ],
        [ 5, { offset: 1 } ],
        [ 6, { offset: 1, limit: 2 } ],
        [ 7, { username: 'sknsksn' } ]
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
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].username).toEqual('lberrios');
        }

        if (id === 3) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].username).toEqual('dbric');
        }
      }
    });
  });

  describe('create users:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'ddkdmkdmd' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ username: 'sksksmskm' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create users' ];
      let payload = [
        [ 1, {} ],
        [ 2, { username: '' } ],
        [ 3, { username: 'ndndnd' } ],
        [ 4, { username: 'ndndnd', password: '' } ],
        [ 5, { password: '' } ],
        [ 6, { username: '', password: '' } ]
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
        setup.assertError(expect, res, 400, 'C14H02-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByUsername: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create users' ];
      let data = {
        employee_id: null,
        username: 'bingo',
        password: 'nanana'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H02-02');
    });
    it(`should return status 403 when user is already taken`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asError({ findByUsername: false });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create users' ];
      let data = {
        username: 'tester',
        password: 'a0123456789z'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 403, 'C14H02-03');
    });
    it(`should return status 500 when something went wrong hashing password`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByUsername: true });
        mocks.bcryptThrow();
      } else {
        mocks.bcryptThrow();
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create users' ];
      let data = {
        username: 'jdndn',
        password: 'kdfkn89z'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H02-04');
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.userIsRejected({ setup });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create users' ];
      let data = {
        employee_id: null,
        username: 'bingo',
        password: 'nanana'
      };

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H02-05');
    });
    it(`should return status 201 when user is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsCreated({ setup });
      }

      // Arrange:
      let bcrypt = require('bcrypt');
      let permissions = [ 'create users' ];
      let payload = [
        [
          1,
          {
            username: 'lingo',
            password: bcrypt.hashSync('nanana', 10)
          }
        ],
        [
          2,
          {
            employee_id: null,
            username: 'lingo',
            password: bcrypt.hashSync('nanana', 10)
          }
        ],
        [
          3,
          {
            employee_id: null,
            username: 'lingo',
            password: bcrypt.hashSync('nanana', 10),
            created_by: setup.instance.users[0].id
          }
        ]
      ];
      let app = require('src/app.js');

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

        if ([1,2,3].includes(id)) {
          await setup.models.User.destroy({
            where: { username: 'lingo' },
            force: true
          });
        }

        if (id === 3) {
          expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        }
      }
    });
  });

  describe('get user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'ddkdmkdmd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403);
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd',
          {}
        ],
        [
          2,
          setup.instance.users[0].id,
          { unknownKey: 'dddd' }
        ],
        [
          3,
          setup.instance.users[0].id,
          { attributes: 'user' }
        ],
        [
          4,
          setup.instance.users[0].id,
          { include: 'user' }
        ],
        [
          5,
          setup.instance.users[0].id,
          { paranoid: 'dmmdmd' }
        ],
      ];

      for (let [ id, user_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400);
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user' ];
      let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404);
    });
    it(`should return status 200 when user is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}`)
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('update user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkmdkdmkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.users[0].id}`)
          .send({ username: 'dkdkmdkdm' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-cccccccccccc',
          {},
          {},
        ],
        [
          2,
          setup.instance.users[0].id,
          {},
          {},
        ],
        [
          3,
          setup.instance.users[0].id,
          { id: '3k3km3km34km34' },
          {},
        ],
        [
          4,
          setup.instance.users[0].id,
          { username: 'demo' },
          { paranoid: 'dkdkmdkdm' },
        ],
      ];

      for (let [ id, user_id, data, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${user_id}`)
          .send(data)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H04-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update user' ];
      let user_id = setup.instance.users[0].id;
      let data = { username: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H04-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update user' ];
      let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { username: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H04-03');
    });
    it(`should return status 500 when user tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update user' ];
      let user_id = setup.instance.users[0].id;
      let data = { username: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H04-04');
    });
    it(`should return status 200 when user is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update user' ];
      let user_id = setup.instance.users[0].id;
      let data = { username: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete user:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkmdkdmkdm' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${setup.instance.users[0].id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-sssssssssssss',
          {}
        ],
        [
          2,
          setup.instance.users[0].id,
          { paranoid: 'kskmsksmks' },
        ],
        [
          3,
          setup.instance.users[0].id,
          { force: 'kskmsksmks' },
        ],
      ];

      for (let [ id, user_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${user_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H05-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H05-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete user' ];
      let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H05-03');
    });
    it(`should return status 500 when user tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H05-04');
    });
    it(`should return status 200 when user was deleted`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.userIsDeleted({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete user' ];
      let user_id = setup.instance.users[0].id;
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
          .del(`${API_BASE}/${user_id}`)
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

  // Roles --------------------------------------------------------------------

  describe('get roles', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles from user' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, setup.instance.users[0].id, { id: 33223 } ],
        [ 3, setup.instance.users[0].id, { paranoid: 'ldfdfm' } ]
      ];

      for (let [ id, user_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H06-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles from user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H06-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles from user' ];
      let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H06-03');
    });
    it(`should return status 500 when roles tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRoles: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles from user' ];
      let user_id = setup.instance.users[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H06-04');
    });
    it(`should return status 200 when roles are filtered`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.rolesAreFiltered({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get roles from user' ];
      let payload = [
        [
          1,
          setup.instance.users[0].id,
          {}
        ],
        [
          2,
          setup.instance.users[0].id,
          { name: 'Designer' }
        ],
        [
          3,
          setup.instance.users[0].id,
          { limit: 1 }
        ],
        [
          4,
          setup.instance.users[0].id,
          { offset: 0, limit: 1 }
        ],
        [
          5,
          setup.instance.users[0].id,
          { sort_by: 'name', order_by: 'asc' }
        ],
        [
          6,
          setup.instance.users[0].id,
          { sort_by: 'name', order_by: 'desc' }
        ],
      ];

      for (let [ id, user_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if ([1,2,3,4,5,6].includes(id)) {
          expect(res.body.data).not.toBeEmpty();
        }

        if ([2].includes(id)) {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toEqual('Designer');
        }
      }
    });
  });

  describe('add roles', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let roles = setup.instance.roles.map(role => role.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${user_id}/roles`)
          .send({ roles })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add roles to user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.roles.map(role => role.id)
        ],
        [
          2,
          setup.instance.users[0].id,
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
        ],
      ];

      for (let [ id, user_id, roles ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${user_id}/roles`)
          .send({ roles })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H07-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add roles to user' ];
      let user_id = setup.instance.users[0].id;
      let roles = setup.instance.roles.map(role => role.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${user_id}/roles`)
        .send({ roles })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H07-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add roles to user' ];
      let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let roles = setup.instance.roles.map(role => role.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${user_id}/roles`)
        .send({ roles })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H07-03');
    });
    it(`should return status 500 when roles tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addRoles: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add roles to user' ];
      let user_id = setup.instance.users[0].id;
      let roles = setup.instance.roles.map(role => role.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${user_id}/roles`)
        .send({ roles })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H07-04');
    });
    it(`should return status 200 when roles were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.rolesAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add roles to user' ];
      let user_id = setup.instance.users[0].id;
      let roles = setup.instance.roles.slice(1, 2).map(role => role.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${user_id}/roles`)
        .send({ roles })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get role', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles/${role_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.roles[0].id,
          {}
        ],
        [
          2,
          setup.instance.users[0].id,
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
          setup.instance.users[0].id,
          setup.instance.roles[0].id,
          { attributes: 'naaaaaa' }
        ],
      ];

      for (let [ id, user_id, role_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles/${role_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H08-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H08-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let user_id = 'f5eacdd2-95e8-4fa9-a12a-7f581a5ee67d';
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H08-03');
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRole: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H08-04');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getRole: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67e';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H08-05');
    });
    it(`should return status 200 when role is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get role from user' ];
      let user_id = setup.instance.users[0].id;
      let roles = await setup.instance.users[0].getRoles({});
      let role_id = roles[0].id;
      let payload = [
        [ 1, {} ],
        [ 1, { attributes: 'name' } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${user_id}/roles/${role_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
      }
    });
  });

  describe('update role', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${user_id}/roles/${role_id}`)
          .send({ extra: { units: 20 } })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H09-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.roles[0].id,
          { extra: { units: 20 } },
          [ 'update role from user' ]
        ],
        [
          2,
          setup.instance.users[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update role from user' ]
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111e',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          { extra: { units: 20 } },
          [ 'update role from user' ]
        ],
        [
          4,
          setup.instance.users[0].id,
          setup.instance.roles[0].id,
          { name: '' },
          [ 'update role from user' ]
        ],
      ];

      for (let [ id, user_id, role_id, data, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${user_id}/roles/${role_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H09-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let data = { extra: { units: 12 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}/roles/${role_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H09-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let role_id = setup.instance.roles[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}/roles/${role_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H09-03');
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRole: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}/roles/${role_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H09-04');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getRole: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}/roles/${role_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H09-05');
    });
    it(`should return status 500 when role tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRole: false, updateRole: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user_id}/roles/${role_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H09-06');
    });
    it(`should return status 200 when role is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update role from user' ];
      let user = setup.instance.users[0];
      let roles = await user.getRoles({});
      let data = { extra: { units: 20 } };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${user.id}/roles/${roles[0].id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('remove role', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kddjfnkdjnkdjfn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C14H10-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Setup:
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.roles[0].id
        ],
        [
          2,
          setup.instance.users[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111a',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      ];

      for (let [ id, user_id, role_id ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C14H10-01');
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H10-02');
    });
    it(`should return status 404 when user was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H10-03');
    });
    it(`should return status 500 when role tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRole: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H10-04');
    });
    it(`should return status 404 when role was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getRole: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C14H10-05');
    });
    it(`should return status 500 when role tried to be removed`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getRole: false, removeRole: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user_id = setup.instance.users[0].id;
      let role_id = setup.instance.roles[0].id;

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C14H10-06');
    });
    it(`should return status 200 when role is removed`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.roleIsRemoved({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'remove role from user' ];
      let user = setup.instance.users[0];
      let user_id = user.id;
      let roles = await user.getRoles({});
      let role_id = roles[0].id;
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
          .delete(`${API_BASE}/${user_id}/roles/${role_id}`)
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
