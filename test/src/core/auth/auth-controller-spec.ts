import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import { signToken } from '../../../../src/utils/helpers';
import Helpers from '../../../config/helpers';


describe('Auth - Controller', () => {
  const helpers = Helpers(db);
  const API_BASE = '/v1';

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
      // Arrange:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/auth/auth-service', () => ({
          AuthService: () => ({
            signIn: async (username:string, password:string) => {
              let user:any = { ...DATA.user };
              user.sub = user.id;
              user.password = undefined;
              return signToken(user, process.env.JWT_SECRET);
            }
          })
        }));
      } else {
        let permission = await db.models.Permission.create(DATA.permission);
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
        await role.addPermission(permission);
        await user.addRole(role);
      }

      let username = DATA.user.username;
      let password = 'PASSword.2119';
      let data = { username, password };
      let payload = { data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/auth/signin`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeJsonWebToken();
    });
  });
});
