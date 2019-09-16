const Datalizer = require('@ncardez/datalizer');
const jsonwebtoken = require('jsonwebtoken');
const {
  methodNotAllowed,
  validateToken,
  trackTime,
  logResponse,
  handleError,
  handleNotFound,
  validateRights,
  validateInput
} = require('src/utils/middlewares');

describe('middlewares.js', () => {
  describe('trackTime', () => {
    it('should be a function', () => {
      expect(trackTime).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(trackTime()).toBeFunction();
    });
    it('should call next without error and have a date on request object', () => {
      // Arrange:
      let req = {};
      let res = {};
      let next = jest.fn();
      let timeBeforeRequest = Date.now();
      let middleware = trackTime();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      expect(req.start).toBeNumber();
      expect(req.start).toBeGreaterThanOrEqual(timeBeforeRequest);
    });
  });
  describe('logResponse', () => {
    it('should be a function', () => {
      expect(logResponse).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(logResponse({})).toBeFunction();
    });
    it('when response has not finished, callback is not executed', () => {
      // Arrange:
      let logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
      let handlers = {};
      let on = jest.fn((name, callback) => { res.handlers[name] = callback; });
      let emit = jest.fn((name, values) => { res.handlers[name](values); });
      let req = { start: Date.now() };
      let res = { handlers, on, emit };
      let next = jest.fn();
      let middleware = logResponse(logger);

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      expect(res.on.mock.calls[0][0]).toEqual('finish');
      expect(logger.info).toBeCalledTimes(0);
      expect(logger.warn).toBeCalledTimes(0);
      expect(logger.error).toBeCalledTimes(0);
    });
    describe('when response has finished and callback is executed', () => {
      it('when logger is not enabled - should not log', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'false';

        // Arrange:
        let logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let req = { start: Date.now() };
        let res = { handlers, on, emit };
        let next = jest.fn();
        let middleware = logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.error).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "info" level be used if status is < 400', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let req = { start: Date.now() };
        let res = { handlers, on, emit };
        let next = jest.fn();
        let middleware = logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(logger.info).toBeCalledTimes(1);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.error).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "warn" level be used if status is >= 400 and < 500', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let error = new Error('Unknown reason yet.');
        error.status = 403;
        let req = { start: Date.now(), error };
        let res = { handlers, on, emit };
        let next = jest.fn();
        let middleware = logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledTimes(1);
        expect(logger.warn.mock.calls[0][1]).toEqual('Unknown reason yet.');
        expect(logger.error).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "error" level be used if status is >= 500', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let logger = { warn: jest.fn(), error: jest.fn(), info: jest.fn() };
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let error = new Error('Unknown reason yet.');
        error.status = 500;
        let req = { start: Date.now(), error };
        let res = { handlers, on, emit };
        let next = jest.fn();
        let middleware = logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.error).toBeCalledTimes(1);
        expect(logger.error.mock.calls[0][1]).toEqual('Unknown reason yet.');

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
    });
  });
  describe('handleError', () => {
    it('should be a function', () => {
      expect(handleError).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(handleError({})).toBeFunction();
    });
    it('should return and object after response', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'Unknown', message: 'Invalid state', status: 400 };
      let req = {};
      let res = {};
      let next = jest.fn();
      res.json = jest.fn();
      res.status = jest.fn(n => res);
      let middleware = handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('Unknown');
      expect(req.error.message).toEqual('Invalid state');
      expect(req.error.status).toEqual(400);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
    it('should return include status 403 when message is "Forbidden"', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'Unknown', message: 'Forbidden.', status: 400 };
      let req = {};
      let res = {};
      let next = jest.fn();
      res.json = jest.fn();
      res.status = jest.fn(n => res);
      let middleware = handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('Unknown');
      expect(req.error.message).toEqual('Forbidden.');
      expect(req.error.status).toEqual(403);
      expect(res.status).toBeCalledWith(403);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
    it('should return include status 404 when message is "Not found"', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'Unknown', message: 'Not found' };
      let req = {};
      let res = {};
      let next = jest.fn();
      res.json = jest.fn();
      res.status = jest.fn(n => res);
      let middleware = handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('Unknown');
      expect(req.error.message).toEqual('Not found.');
      expect(req.error.status).toEqual(404);
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
    it('should return include status 400 when error name is "SequelizeUniqueConstraintError"', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'SequelizeUniqueConstraintError', message: 'Name must be unique' };
      let req = {};
      let res = {};
      let next = jest.fn();
      res.json = jest.fn();
      res.status = jest.fn(n => res);
      let middleware = handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('SequelizeUniqueConstraintError');
      expect(req.error.message).toEqual('Validation error');
      expect(req.error.status).toEqual(400);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
    it('should return include status 502 when error name is "SequelizeConnectionError"', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'SequelizeConnectionError', message: 'Connection long' };
      let req = {};
      let res = {};
      let next = jest.fn();
      res.json = jest.fn();
      res.status = jest.fn(n => res);
      let middleware = handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('SequelizeConnectionError');
      expect(req.error.message).toEqual('Bad Gateway.');
      expect(req.error.status).toEqual(502);
      expect(res.status).toBeCalledWith(502);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
  });
  describe('handleNotFound', () => {
    it('should be a function', () => {
      expect(handleNotFound).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(handleNotFound()).toBeFunction();
    });
    it('should call next with error', () => {
      // Arrange:
      let req = {};
      let res = {};
      let next = jest.fn();
      let middleware = handleNotFound();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0][0].message).toEqual('Not found.');
      expect(next.mock.calls[0][0].status).toEqual(404);
      expect(next.mock.calls[0][0].code).toEqual(404);
    });
  });
  describe('methodNotAllowed', () => {
    it('should be a function', () => {
      expect(methodNotAllowed).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(methodNotAllowed()).toBeFunction();
    });
    it('should call next with error', () => {
      // Arrange:
      let req = {};
      let res = {};
      let next = jest.fn();
      let middleware = methodNotAllowed();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0][0].message).toEqual('Method Not allowed.');
      expect(next.mock.calls[0][0].status).toEqual(405);
      expect(next.mock.calls[0][0].code).toEqual(405);
    });
  });
  describe('validateToken', () => {
    it('should be a function', () => {
      expect(validateToken).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(validateToken({})).toBeFunction();
    });
    describe('should call next without error', () => {
      it('when url is public', () => {
        // Arrange:
        let req = { url: '/v1/auth/signin', headers: {} };
        let res = {};
        let next = jest.fn();
        let middleware = validateToken(jsonwebtoken);

        // Act:
        middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
      it('when token is valid', () => {
        // Arrange:
        let token = `Bearer ${jsonwebtoken.sign({ sub: 'norman', roles: [], permissions: [] }, process.env.JWT_SECRET)}`;
        let req = { url: '/orders/123', headers: { authorization: token } };
        let res = {};
        let next = jest.fn();
        let middleware = validateToken(jsonwebtoken);

        // Act:
        middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
    });
    describe('should call next with error', () => {
      describe('when url is not public', () => {
        [
          {
            title: 'and authorization header is not present',
            req: { url: '/orders/123', headers: {} }
          },
          {
            title: 'and token signature is not does not include the "Bearer" placeholder',
            req: { url: '/orders/123', headers: { authorization: 'kjskjdnf' } }
          },
          {
            title: 'and token signature includes placeholder, but still invalid',
            req: { url: '/orders/123', headers: { authorization: 'Bearer ' } }
          },
          {
            title: 'and token signature includes placeholder, the token is completely invalid',
            req: { url: '/orders/123', headers: { authorization: 'Bearer <ssss' } }
          }
        ].forEach(({ title, req }, index) => {
          it(title, () => {
            // Arrange:
            let res = {};
            let next = jest.fn();
            let middleware = validateToken(jsonwebtoken);

            // Act:
            middleware(req, res, next);

            // Assert:
            expect(next.mock.calls[0][0].message).toEqual('Unauthorized');
            expect(next.mock.calls[0][0].status).toEqual(401);
            expect(next.mock.calls[0][0].code).toEqual('MVT0' + (index + 1)); // remove this line.
          });
        });
      });
      describe('when payload is not valid', () => {
        [
          {
            title: 'and token does not have valid sub value',
            token: `Bearer ${jsonwebtoken.sign({ name: 'norman' }, process.env.JWT_SECRET)}`
          },
          {
            title: 'and token does not have valid roles value',
            token: `Bearer ${jsonwebtoken.sign({ sub: 'norman' }, process.env.JWT_SECRET)}`
          },
          {
            title: 'and token does not have valid permissions value',
            token: `Bearer ${jsonwebtoken.sign({ sub: 'norman', roles: [] }, process.env.JWT_SECRET)}`
          }
        ].forEach(({ title, token }, index) => {
          it(title, () => {
            // Arrange:
            let req = { url: '/orders/123', headers: { authorization: token } };
            let res = {};
            let next = jest.fn();
            let middleware = validateToken(jsonwebtoken);

            // Act:
            middleware(req, res, next);

            // Assert:
            expect(next.mock.calls[0][0].message).toEqual('Unauthorized');
            expect(next.mock.calls[0][0].status).toEqual(401);
            expect(next.mock.calls[0][0].code).toEqual('MVT0' + (4 + (index + 1))); // remove this line.
          });
        });
      });
    });
  });
  describe('input', () => {
    describe('validateInput', () => {
      it('should be a function', () => {
        expect(validateInput).toBeFunction();
      });
      it('should return a function after invocation', async () => {
        // Arrange:
        let schema = {
          name: {
            $type: 'string',
            $max: 20,
            $empty: false,
            $min: 2
          }
        };

        // Act:
        let middleware = validateInput(schema);

        // Assert:
        expect(middleware).toBeFunction();
      });
      it('should call next with error when validation fail', async () => {
        // Arrange:
        let middleware = validateInput(new Datalizer({
          query: {
            $type: 'object',
            $keys: {
              name: {
                $type: 'string',
                $max: 20,
                $empty: false,
                $min: 2
              }
            }
          }
        }));
        let req = { query: { name: 'm' }, body: {}, params: {} };
        let res = {};
        let next = jest.fn();

        // Act:
        await middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0][0].name).toEqual('DatalizerValidationError');
        expect(next.mock.calls[0][0].message).toEqual('Validation failed');
        expect(next.mock.calls[0][0].errors).toBeArray().not.toBeEmpty();
        expect(next.mock.calls[0][0].errors[0].message).toEqual('{name} - min chars allowed is 2, but got 1.');
      });
      it('should call next without error when validation pass', async () => {
        // Arrange:
        let middleware = validateInput(new Datalizer({
          query: {
            $type: 'object',
            $keys: {
              name: {
                $type: 'string',
                $max: 20,
                $empty: false,
                $min: 2
              }
            }
          }
        }));
        let req = { query: { name: 'norman' }, body: {}, params: {} };
        let res = {};
        let next = jest.fn();

        // Act:
        await middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
    });
  });
  describe('rights', () => {
    describe('validateRights', () => {
      it('should be a function', () => {
        expect(validateRights).toBeFunction();
      });
      it('should return a function middleware after invocation', async () => {
        // Arrange:
        let permission = 'create order';

        // Act:
        let middleware = validateRights(permission);

        // Assert:
        expect(middleware).toBeFunction();
      });
      it('should call next with error when validation fail', async () => {
        // Arrange:
        let req = {
          token: {
            permissions: [
              'get orders',
              'get order',
              'cancel order'
            ]
          }
        };
        let res = {};
        let next = jest.fn();
        let middleware = validateRights('create order');

        // Act:
        await middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0][0].name).toEqual('Error');
        expect(next.mock.calls[0][0].message).toEqual('Forbidden');
        expect(next.mock.calls[0][0].status).toEqual(403);
      });
      it('should call next without error when validation pass', async () => {
        // Arrange:
        let req = {
          token: {
            permissions: [
              'get orders',
              'get order',
              'cancel order'
            ]
          }
        };
        let res = {};
        let next = jest.fn();
        let middleware = validateRights('cancel order');

        // Act:
        await middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
    });
  });
});
