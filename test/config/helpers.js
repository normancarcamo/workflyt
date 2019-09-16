let jsonwebtoken = require('jsonwebtoken');
let supertest = require('supertest');
let uuid = require('uuid/v4');

module.exports = function(db) {
  let helpers = {};

  helpers.assertPass = function({ response, status }) {
    if (!response.ok) {
      console.log('=====================================================');
      console.log('helpers.assertPass has failed instead of pass!');
      console.log('body:', response.body);
      console.log('body.data:', response.body.data);
      console.log('body.error:', response.body.error);
      if (response.body.error.errors) {
        console.log('errors:', response.body.error.errors);
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

  helpers.assertFail = function({ response, status, code }) {
    if (response.ok) {
      console.log('=====================================================');
      console.log('helpers.assertFail is passing instead of fail!');
      console.log('body:', response.body);
      console.log('body.data:', response.body.data);
      console.log('body.error:', response.body.error);
      if (response.body.error.errors) {
        console.log('errors:', response.body.error.errors);
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

  helpers.destroyData = async function() {
    if (process.env.MOCK !== 'true') {
      for (let model in db.models) {
        await db.models[model].destroy({ where: {}, force: true, });
      }
    }
  }

  helpers.restoreMocks = async function() {
    if (process.env.MOCK === 'true') {
      jest.dontMock('src/core/areas/areas-service.js');
      jest.dontMock('src/core/auth/auth-service.js');
      jest.dontMock('src/core/categories/categories-service.js');
      jest.dontMock('src/core/clients/clients-service.js');
      jest.dontMock('src/core/companies/companies-service.js');
      jest.dontMock('src/core/jobs/jobs-service.js');
      jest.dontMock('src/core/materials/materials-service.js');
      jest.dontMock('src/core/orders/orders-service.js');
      jest.dontMock('src/core/permissions/permissions-service.js');
      jest.dontMock('src/core/quotes/quotes-service.js');
      jest.dontMock('src/core/roles/roles-service.js');
      jest.dontMock('src/core/services/services-service.js');
      jest.dontMock('src/core/stocks/stocks-service.js');
      jest.dontMock('src/core/suppliers/suppliers-service.js');
      jest.dontMock('src/core/users/users-service.js');
      jest.dontMock('src/core/warehouses/warehouses-service.js');
      jest.dontMock('src/core/workers/workers-service.js');
      jest.resetModules();
    }
  }

  helpers.closeConnections = async function() {
    if (process.env.MOCK !== 'true') {
      await db.sequelize.close();
    }
  }

  helpers.serviceNotFoundError = async () => {
    let error = new Error('Not found');
    error.status = 404;
    throw error;
  };

  helpers.serviceUniqueError = async () => {
    let error = new Error('Validation error');
    error.status = 400;
    throw error;
  };

  helpers.serviceForbiddenError = async () => {
    let error = new Error('Forbidden');
    error.status = 403;
    throw error;
  };

  helpers.genToken = function(data) {
    return jsonwebtoken.sign({
      sub: uuid(),
      username: 'tester',
      password: 'a0123456789z',
      roles: [],
      permissions: [],
      ...data
    }, process.env.JWT_SECRET);
  }

  helpers.request = {};

  for (let method of [ 'get', 'post', 'put', 'delete', 'patch' ]) {
    helpers.request[method] = (url, { query, options, send, data, permissions }) => {
      let req = supertest(require('src/app.js'))
        [method || 'get'](url)
        .query({ ...query ? query : options })
        .send({ ...send ? send : data })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      if (permissions) {
        req.set('Authorization', `Bearer ${helpers.genToken({ permissions })}`);
      }

      return req;
    };
  }

  return helpers;
}
