const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const HELPERS = require('src/utils/helpers');
const API_BASE = '/v1';

describe('Auth - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Sign in', () => {
    it('POST /auth/sign --> Invalid Input', async () => {
      // Arrange:
      let username = 'a';
      let password = 'd';
      let data = { username, password }
      let payload = { data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/auth/signin`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('POST /auth/sign --> Invalid Credentials', async () => {
      // Arrange:
      let username = 'unregisteredUser';
      let password = 'Any.P@sswOrd-2';
      let data = { username, password }
      let payload = { data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/auth/signin`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('POST /auth/sign --> Can login', async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/auth/auth-service', () => () => ({
          signIn: async ({ username, password }) => {
            let user = { ...DATA.user };
            user.sub = user.id;
            user.password = undefined;
            return HELPERS.signToken({
              payload: user,
              secret: process.env.JWT_SECRET
            });
          }
        }));
      } else {
        let permission = await db.models.Permission.create(DATA.permission);
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
        await role.addPermission(permission);
        await user.addRole(role);
      }

      // Arrange:
      let username = DATA.user.username;
      let password = 'PASSword.2119';
      let data = { username, password };
      let payload = { data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/auth/signin`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeString().not.toBeEmpty().toIncludeRepeated(/\./, 2);
      expect(res.body.data.split('.')).toBeArray().not.toBeEmpty().toHaveLength(3);
      expect(res.body.data.length).toSatisfy(n => n > 100);
    });
  });
});
