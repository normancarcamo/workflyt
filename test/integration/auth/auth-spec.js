const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/auth';

describe('Auth Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.resetModules();
    jest.unmock('src/core/auth/auth-repository');
    jest.unmock('src/core/auth/auth-adapter');
  });

  describe('Sign In:', () => {
    it(`should return status 400 when data validation fail`, async () => {
      // Given:
      let app = require('src/app.js');
      let payloads = [
        { username: '' },
        { username: 'abcdefghijklmnopqrstuvwxyz1234567890', password: '' },
        { username: '', password: 'mmnnnngs' },
        { password: '' },
        { password: 'mm' },
        { password: 'mmmsmmssm' },
        { username: '', password: '' }
      ];

      for (let data of payloads) {
        // When:
        let res = await supertest(app)
          .post(`${API_BASE}/signin`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

        // Then:
        setup.assertError(expect, res, 400);
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      jest.doMock('src/core/auth/auth-repository', () => database => ({
        findUserWithRoles: async ({ username }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'avir', password: 'mmmsmmssm' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 404 when user was not found`, async () => {
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserWithRoles: ({ username }) => {
            return Promise.resolve(null);
          }
        }));
      }

      // Given:
      let app = require('src/app.js');
      let data = { username: 'ksnsknsk', password: 'mmmsmmssm' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 404);
    });
    it(`should return status 500 when something went wrong comparing password`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserWithRoles: ({ username }) => {
            return Promise.resolve({
              username: 'tester',
              password: 'FAkEpAsS'
            });
          }
        }));
      }

      jest.doMock('src/core/auth/auth-adapter', () => database => ({
        comparePassword: async ({ passwordA, passwordB }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'tester', password: 'FAkEpAsS' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 403 when password does not match`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserWithRoles: ({ username }) => {
            return Promise.resolve({
              username: 'tester',
              password: require('bcrypt').hashSync('FAkEpAsS', 10)
            });
          }
        }));
      }

      // Given:
      let app = require('src/app.js');
      let data = { username: 'tester', password: 'nonPassword2Match' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 403);
    });
    it(`should return status 500 when tries to sign the token`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserWithRoles: ({ username }) => {
            return Promise.resolve({
              username: 'tester',
              password: require('bcrypt').hashSync('FAkEpAsS', 10),
              roles: [ 'Tester' ],
              permissions: [ 'resource' ]
            });
          }
        }));
      }

      jest.doMock('src/core/auth/auth-adapter', () => database => ({
        comparePassword: ({ passwordA, passwordB }) => {
          return Promise.resolve(true);
        },
        signToken: ({ payload, secret }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'tester', password: 'FAkEpAsS' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 200 when user logs in`, async () => {
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserWithRoles: ({ username }) => {
            return Promise.resolve({
              username: 'tester',
              password: require('bcrypt').hashSync('FAkEpAsS', 10),
              roles: [ 'Tester' ],
              permissions: [ 'resource' ]
            });
          }
        }));

        jest.doMock('src/core/auth/auth-adapter', () => database => ({
          comparePassword: ({ passwordA, passwordB }) => {
            return Promise.resolve(true);
          },
          signToken: ({ payload, secret }) => {
            return '2lk3ml2m.l2m3l4km2l3k4m2l3km4l.23kmlk322224';
          }
        }));
      }

      // Given:
      let app = require('src/app.js');
      let data = {
        username: 'tester',
        password: 'a0123456789z'
      };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signin`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('Sign Up:', () => {
    it(`should return status 400 when data validation fail`, async () => {
      // Given:
      let app = require('src/app.js');
      let payloads = [
        { username: '' },
        { username: 'abcdefghijklmnopqrstuvwxyz1234567890', password: '' },
        { username: '', password: 'mmnnnngs' },
        { password: '' },
        { password: 'mm' },
        { password: 'mmmsmmssm' },
        { username: '', password: '' }
      ];

      for (let data of payloads) {
        // When:
        let res = await supertest(app)
          .post(`${API_BASE}/signup`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json');

        // Then:
        setup.assertError(expect, res, 400);
      }
    });
    it(`should return status 500 when user tried to be found`, async () => {
      // Setup:
      jest.doMock('src/core/auth/auth-repository', () => database => ({
        findUserByUsername: async ({ username }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'tester', password: 'sksksmksm' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 403 when user is already taken`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserByUsername: ({ username }) => {
            return Promise.resolve(true);
          }
        }));
      }

      // Given:
      let app = require('src/app.js');
      let data = { username: 'tester', password: 'bingo' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 403);
    });
    it(`should return status 500 when something went wrong hashing password`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserByUsername: ({ username }) => {
            return Promise.resolve(null);
          }
        }));
      }

      jest.doMock('src/core/auth/auth-adapter', () => database => ({
        hashPassword: async ({ password, salt }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'avir', password: 'bingo' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 500 when user tried to be created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserByUsername: ({ username }) => {
            return Promise.resolve(null);
          }
        }));
      } else {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserByUsername: ({ username }) => {
            return Promise.resolve(null);
          },
          createUser: ({ username, password }) => {
            return Promise.reject(new Error('error mocked.'));
          }
        }));
      }

      jest.doMock('src/core/auth/auth-adapter', () => dependencies => ({
        hashPassword: async ({ password, salt }) => {
          return 'skdjnks.dnskdjkdjsnkjsdksjdnksjdnkfjnk.j23nk2j3n2';
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'enmanuel19', password: 'nuel1922' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 500 when something went wrong signing the token`, async () => {
      // Setup:
      jest.doMock('src/core/auth/auth-repository', () => database => ({
        findUserByUsername: ({ username }) => {
          return Promise.resolve(null);
        },
        createUser: ({ username, password }) => {
          return Promise.resolve({ username, password });
        }
      }));

      jest.doMock('src/core/auth/auth-adapter', () => dependencies => ({
        hashPassword: ({ password, salt }) => {
          return Promise.resolve('skdjnks.dnk.j23nk2j3n2');
        },
        signToken: ({ payload, secret }) => {
          throw new Error('error mocked.');
        }
      }));

      // Given:
      let app = require('src/app.js');
      let data = { username: 'avir', password: 'bingo' };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // then:
      setup.assertError(expect, res, 500);
    });
    it(`should return status 201 when user is created`, async () => {
      if (setup.is_mocked) {
        jest.doMock('src/core/auth/auth-repository', () => database => ({
          findUserByUsername: ({ username }) => {
            return Promise.resolve(null);
          },
          createUser: ({ username, password }) => {
            return Promise.resolve({ username, password });
          }
        }));

        jest.doMock('src/core/auth/auth-adapter', () => dependencies => ({
          hashPassword: ({ password, salt }) => {
            return Promise.resolve('skdjnks.dnk.j23nk2j3n2');
          },
          signToken: ({ payload, secret }) => {
            return 'dsnkjsdn.ksdkjsdnkjdnf.ksdjsnsksjdn';
          }
        }));
      }

      // Given:
      let app = require('src/app.js');
      let data = {
        username: 'enmanuel19',
        password: 'nuel1922'
      };

      // When:
      let res = await supertest(app)
        .post(`${API_BASE}/signup`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      setup.assertOk(expect, res, 201);
    });
  });

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
