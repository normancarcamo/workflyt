import setup_factory from './index';
import { request } from 'test/utils';
import db from 'src/db/models';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/auth';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { User } = db.sequelize.models;

describe("Auth Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("Sign In:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - username and password match`, async () => {
        // Given:
        let data = {
          username: 'normancarcamo',
          password: 'bingo'
        };

        // When:
        let res = await request("post", `${API_BASE}/signin`).send(data);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(false);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - data validation fails`, async () => {
        // Given:
        let dataCases = [
          { username: '' },
          { username: 'abcdefghijklmnopqrstuvwxyz1234567890', password: '' },
          { username: '', password: 'mmnnnngs' },
          { password: '' },
          { password: 'mm' },
          { password: 'mmmsmmssm' },
          { username: '', password: '' }
        ];

        for (let data of dataCases) {
          // When:
          let res = await request("post", `${API_BASE}/signin`).send(data);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        }
      });
      it(`${uuid()} - user has not been found`, async () => {
        // Given:
        let data = { username: 'ksnsknsk', password: 'mmmsmmssm' };

        // When:
        let res = await request("post", `${API_BASE}/signin`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user access is denied`, async () => {
        // Given:
        let data = { username: 'normancarcamo', password: 'mmmsmmssm' };

        // When:
        let res = await request("post", `${API_BASE}/signin`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - actions throw error`, async () => {
        // Mock:
        jest.spyOn(User, 'findOne').mockRejectedValue(ERROR_MOCK);

        // Given:
        let data = { username: 'omyudnfcc', password: 'sksksmksm' };

        // When:
        let res = await request('post', `${API_BASE}/signin`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("Sign Up:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - user is created`, async () => {
        // Given:
        let data = {
          username: 'enmanuel19',
          password: 'nuel1922'
        };

        // When:
        let res = await request("post", `${API_BASE}/signup`).send(data);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(false);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - data validation fails`, async () => {
        // Given:
        let dataCases = [
          { username: '' },
          { username: 'abcdefghijklmnopqrstuvwxyz1234567890', password: '' },
          { username: '', password: 'mmnnnngs' },
          { password: '' },
          { password: 'mm' },
          { password: 'mmmsmmssm' },
          { username: '', password: '' }
        ];

        for (let data of dataCases) {
          // When:
          let res = await request("post", `${API_BASE}/signup`).send(data);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        }
      });
      it(`${uuid()} - user is already taken`, async () => {
        // Given:
        let data = { username: 'normancarcamo', password: 'bingo' };

        // When:
        let res = await request("post", `${API_BASE}/signup`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - the user was trying to be found`, async () => {
        // Mock:
        jest.spyOn(User, 'findOne').mockRejectedValue(ERROR_MOCK);

        // Given:
        let data = { username: 'normancarcamo', password: 'sksksmksm' };

        // When:
        let res = await request('post', `${API_BASE}/signup`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - the user was trying to be created`, async () => {
        // Mock:
        jest.spyOn(User, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let data = { username: 'enmanuel19', password: 'nuel1922' };

        // When:
        let res = await request('post', `${API_BASE}/signup`).send(data);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
