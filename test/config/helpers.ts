import jsonwebtoken from 'jsonwebtoken';
import supertest, { SuperTest, Test, Request } from 'supertest';
import uuid from 'uuid/v4';
import { Idatabase } from 'src/providers/postgres/types';

export default function(db: Idatabase) {
  const helpers:{ [key: string]: any } = {};
  type TassertPass = ({ response, status }:{ response:any, status:number }) => any;
  type TassertFail = ({ response, status, code }:{ response:any, status:number, code:any }) => any;
  type TdestroyData = () => Promise<void>;
  type TrestoreMocks = () => Promise<void>;
  type TcloseConnections = () => Promise<void>;
  type TserviceNotFoundError = () => Promise<void>;
  type TserviceUniqueError = () => Promise<void>;
  type TserviceForbiddenError = () => Promise<void>;
  type TgenToken = (data:any) => string
  type Tmethod = (
    url:string,
    { query, options, send, data, permissions }:
    { query?:object, options?:object, send?:object, data?:object, permissions?:string[] }
  ) => Request;
  type Trequest = {
    get:Tmethod;
    post: Tmethod;
    put: Tmethod;
    delete: Tmethod;
    patch: Tmethod;
  };

  helpers.assertPass = <TassertPass> function({ response, status }) {
    if (!response.ok) {
      console.log('=====================================================');
      console.log('helpers.assertPass has failed instead of pass!');
      console.log('body:', response.body);
      console.log('body.data:', response.body.data);
      console.log('body.error:', response.body.error);
      if (response.body.error) {
        if (response.body.error.errors) {
          console.log('errors:', response.body.error.errors);
        }
      }
      console.log('=====================================================');
      return;
    }
    expect(response.type).toBe('application/json');
    expect(response.ok).toBe(true);
    expect(response.clientError).toBe(false);
    expect(response.serverError).toBe(false);
    expect(response.status).toBe(status);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  }

  helpers.assertFail = <TassertFail> function({ response, status, code }) {
    if (response.ok) {
      console.log('=====================================================');
      console.log('helpers.assertFail is passing instead of fail!');
      console.log('body:', response.body);
      console.log('body.data:', response.body.data);
      console.log('body.error:', response.body.error);
      if (response.body.error) {
        if (response.body.error.errors) {
          console.log('errors:', response.body.error.errors);
        }
      }
      console.log('=====================================================');
      return;
    }
    expect(response.type).toBe('application/json');
    expect(response.ok).toBe(false);
    expect(response.serverError).toBe(status >= 500);
    expect(response.status).toBe(status);
    expect(response.body).toBeObject().not.toBeEmpty();
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeObject().not.toBeEmpty();
    expect(response.body.error.name).toBeDefined();
    expect(response.body.error.message).toBeDefined();
    expect(response.body.error.status).toBe(status);
    if (code) {
      expect(response.body.error.code).toBe(code);
    }
  }

  helpers.destroyData = <TdestroyData> async function() {
    if (process.env.MOCK !== 'true') {
      for (let model in db.models) {
        await db.models[model].destroy({ where: {}, force: true, });
      }
    }
  }

  helpers.restoreMocks = <TrestoreMocks> async function() {
    if (process.env.MOCK === 'true') {
      jest.dontMock('src/core/areas/areas-service');
      jest.dontMock('src/core/auth/auth-service');
      jest.dontMock('src/core/categories/categories-service');
      jest.dontMock('src/core/clients/clients-service');
      jest.dontMock('src/core/companies/companies-service');
      jest.dontMock('src/core/jobs/jobs-service');
      jest.dontMock('src/core/materials/materials-service');
      jest.dontMock('src/core/orders/orders-service');
      jest.dontMock('src/core/permissions/permissions-service');
      jest.dontMock('src/core/quotes/quotes-service');
      jest.dontMock('src/core/roles/roles-service');
      jest.dontMock('src/core/services/services-service');
      jest.dontMock('src/core/stocks/stocks-service');
      jest.dontMock('src/core/suppliers/suppliers-service');
      jest.dontMock('src/core/users/users-service');
      jest.dontMock('src/core/warehouses/warehouses-service');
      jest.dontMock('src/core/workers/workers-service');
      jest.resetModules();
    }
  }

  helpers.closeConnections = <TcloseConnections> async function() {
    if (process.env.MOCK !== 'true') {
      await db.sequelize.close();
    }
  }

  helpers.serviceNotFoundError = <TserviceNotFoundError> async function() {
    let error = new Error('Not found') as any;
    error.status = 404;
    throw error;
  };

  helpers.serviceUniqueError = <TserviceUniqueError> async function () {
    let error = new Error('Validation error') as any;
    error.status = 400;
    throw error;
  };

  helpers.serviceForbiddenError = <TserviceForbiddenError> async function() {
    let error = new Error('Forbidden') as any;
    error.status = 403;
    throw error;
  };

  helpers.genToken = <TgenToken> function(data) {
    let token = jsonwebtoken.sign({
      sub: uuid(),
      username: 'tester',
      password: 'a0123456789z',
      roles: [],
      permissions: [],
      ...data
    }, process.env.JWT_SECRET as string);
    return token;
  }

  helpers.request = <Trequest>{};

  let methods:string[] = [ 'get', 'post', 'put', 'delete', 'patch' ];

  interface TSuperTest extends SuperTest<Test> { [key: string]: any }

  for (let method of methods) {
    helpers.request[method] = <Tmethod> function (url, { query, options, send, data, permissions }) {
      let app = require('src/app').default;
      let agent:TSuperTest = supertest(app);
      let request:Request = agent[method](url);

      request.query({ ...query || options });
      request.send({ ...send || data });
      request.set('Content-Type', 'application/json');
      request.set('Accept', 'application/json');

      if (permissions) {
        request.set('Authorization', `Bearer ${helpers.genToken({ permissions })}`);
      }

      return request;
    };
  }

  return helpers;
}
