import '../../config/global';
import Datalizer from '@ncardez/datalizer';
import jsonwebtoken from 'jsonwebtoken';
import * as middlewares from '../../../src/utils/middlewares';
import pino, { Logger } from 'pino';

describe('middlewares.js', () => {
  describe('trackTime', () => {
    it('should be a function', () => {
      expect(middlewares.trackTime).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.trackTime()).toBeFunction();
    });
    it('should call next without error and have a date on request object', () => {
      // Arrange:
      let req:any = {};
      let res:any = {};
      let next = jest.fn();
      let timeBeforeRequest = Date.now();
      let middleware = middlewares.trackTime();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      expect(req.start).toBeNumber();
      expect(req.start).toBeGreaterThanOrEqual(timeBeforeRequest);
    });
  });
  describe('logResponse', () => {
    let logger:Logger;
    let spyLoggerInfo:any;
    let spyLoggerError:any;
    let spyLoggerWarn:any;

    beforeEach(() => {
      logger = pino();
      spyLoggerInfo = jest.spyOn(logger, 'info').mockImplementation(jest.fn);
      spyLoggerError = jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      spyLoggerWarn = jest.spyOn(logger, 'warn').mockImplementation(jest.fn);
    });

    it('should be a function', () => {
      expect(middlewares.logResponse).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.logResponse(pino())).toBeFunction();
    });
    it('when response has not finished, callback is not executed', () => {
      // Arrange:
      let logger = pino();
      let handlers = {};
      let on = jest.fn((name, callback) => { res.handlers[name] = callback; });
      let emit = jest.fn((name, values) => { res.handlers[name](values); });
      let req:any = { start: Date.now() };
      let res:any = { handlers, on, emit };
      let next = jest.fn();
      // let spyLoggerInfo = jest.spyOn(logger, 'info').mockImplementation(jest.fn);
      // let spyLoggerError = jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      // let spyLoggerWarn = jest.spyOn(logger, 'warn').mockImplementation(jest.fn);
      let middleware = middlewares.logResponse(logger);

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      expect(res.on.mock.calls[0][0]).toEqual('finish');
      expect(spyLoggerInfo).toBeCalledTimes(0);
      expect(spyLoggerWarn).toBeCalledTimes(0);
      expect(spyLoggerError).toBeCalledTimes(0);
    });
    describe('when response has finished and callback is executed', () => {
      it('when logger is not enabled - should not log', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'false';

        // Arrange:
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let req:any = { start: Date.now() };
        let res:any = { handlers, on, emit };
        let next = jest.fn();
        let middleware = middlewares.logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(spyLoggerInfo).toBeCalledTimes(0);
        expect(spyLoggerWarn).toBeCalledTimes(0);
        expect(spyLoggerError).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "info" level be used if status is < 400', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let req:any = { start: Date.now() };
        let res:any = { handlers, on, emit };
        let next = jest.fn();
        let middleware = middlewares.logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(spyLoggerInfo).toBeCalledTimes(1);
        expect(spyLoggerWarn).toBeCalledTimes(0);
        expect(spyLoggerError).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "warn" level be used if status is >= 400 and < 500', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let error:any = new Error('Unknown reason yet.');
        error.status = 403;
        let req:any = { start: Date.now(), error };
        let res:any = { handlers, on, emit };
        let next = jest.fn();
        let middleware = middlewares.logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(spyLoggerInfo).toBeCalledTimes(0);
        expect(spyLoggerWarn).toBeCalledTimes(1);
        expect(spyLoggerWarn.mock.calls[0][1]).toEqual('Unknown reason yet.');
        expect(spyLoggerError).toBeCalledTimes(0);

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
      it('when logger is enabled, should "error" level be used if status is >= 500', () => {
        // Setup:
        const LOG_ENABLED = process.env.LOG_ENABLED;
        process.env.LOG_ENABLED = 'true';

        // Arrange:
        let handlers = {};
        let on = jest.fn((name, cb) => { res.handlers[name] = cb; });
        let emit = jest.fn((name, values) => { res.handlers[name](); });
        let error:any = new Error('Unknown reason yet.');
        error.status = 500;
        let req:any = { start: Date.now(), error };
        let res:any = { handlers, on, emit };
        let next = jest.fn();
        let middleware = middlewares.logResponse(logger);

        // Act:
        middleware(req, res, next);
        res.emit('finish');

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
        expect(res.on.mock.calls[0][0]).toEqual('finish');
        expect(spyLoggerInfo).toBeCalledTimes(0);
        expect(spyLoggerWarn).toBeCalledTimes(0);
        expect(spyLoggerError).toBeCalledTimes(1);
        expect(spyLoggerError.mock.calls[0][1]).toEqual('Unknown reason yet.');

        // Teardown:
        process.env.LOG_ENABLED = LOG_ENABLED;
      });
    });
  });
  describe('handleError', () => {
    it('should be a function', () => {
      expect(middlewares.handleError).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.handleError()).toBeFunction();
    });
    it('should return and object after response', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err = { name: 'Unknown', message: 'Invalid state', status: 400 };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn(n => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

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
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn(n => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

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
      let err:any = { name: 'Unknown', message: 'Not found' };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn((n:number) => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

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
    it('should return include status 405 when message is "Method Not Allowed"', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'unknown';

      // Arrange:
      let err:any = { name: 'Error', message: 'Method Not Allowed' };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn((n:number) => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).toEqual('Error');
      expect(req.error.message).toEqual('Method Not Allowed');
      expect(req.error.status).toEqual(405);
      expect(res.status).toBeCalledWith(405);
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
      let err:any = { name: 'SequelizeUniqueConstraintError', message: 'Name must be unique' };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn((n:number) => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

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
      let err:any = { name: 'SequelizeConnectionError', message: 'Connection long' };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn((n:number) => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

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
    it('should not include name and reason keys on object returned when is on Production env', () => {
      // Setup:
      const NODE_ENV = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Arrange:
      let err = { name: 'Unknown', message: 'Invalid state', status: 400 };
      let req:any = {};
      let res:any = { json: jest.fn(), status: jest.fn(n => res) };
      let next = jest.fn();
      let middleware = middlewares.handleError();

      // Act:
      middleware(err, req, res, next);

      // Assert:
      expect(req.error).toBeObject().not.toBeEmpty();
      expect(req.error.name).not.toBeDefined();
      expect(req.error.reason).not.toBeDefined();
      expect(req.error.message).toEqual('Invalid state');
      expect(req.error.status).toEqual(400);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ success: false, error: req.error });
      expect(next).toBeCalledTimes(0);

      // Teardown:
      process.env.NODE_ENV = NODE_ENV;
    });
  });
  describe('handleNotFound', () => {
    it('should be a function', () => {
      expect(middlewares.handleNotFound).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.handleNotFound()).toBeFunction();
    });
    it('should call next with error', () => {
      // Arrange:
      let req:any = {};
      let res:any = {};
      let next = jest.fn();
      let middleware = middlewares.handleNotFound();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0][0].message).toEqual('Not found.');
    });
  });
  describe('methodNotAllowed', () => {
    it('should be a function', () => {
      expect(middlewares.methodNotAllowed).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.methodNotAllowed()).toBeFunction();
    });
    it('should call next with error', () => {
      // Arrange:
      let req:any = {};
      let res:any = {};
      let next = jest.fn();
      let middleware = middlewares.methodNotAllowed();

      // Act:
      middleware(req, res, next);

      // Assert:
      expect(next.mock.calls[0][0].message).toEqual('Method Not allowed.');
    });
  });
  describe('validateToken', () => {
    it('should be a function', () => {
      expect(middlewares.validateToken).toBeFunction();
    });
    it('should return a middleware function after invocation', () => {
      expect(middlewares.validateToken(jsonwebtoken)).toBeFunction();
    });
    describe('should call next without error', () => {
      it('when url is public', () => {
        // Arrange:
        let req:any = { url: '/v1/auth/signin', headers: {} };
        let res:any = {};
        let next = jest.fn();
        let middleware = middlewares.validateToken(jsonwebtoken);

        // Act:
        middleware(req, res, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
      it('when token is valid', () => {
        // Arrange:
        let payload = { sub: 'norman', roles: [], permissions: [] };
        let secret:string = process.env.JWT_SECRET as string;
        let token = `Bearer ${jsonwebtoken.sign(payload, secret)}`;
        let req:any = { url: '/orders/123', headers: { authorization: token } };
        let res:any = {};
        let next = jest.fn();
        let middleware = middlewares.validateToken(jsonwebtoken);

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
            title: 'and token signature does not include the "Bearer" placeholder',
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
            let res:any = {};
            let next = jest.fn();
            let middleware = middlewares.validateToken(jsonwebtoken);

            // Act:
            middleware(req as any, res, next);

            // Assert:
            expect(next.mock.calls[0][0].message).toEqual('Unauthorized');
            expect(next.mock.calls[0][0].status).toEqual(401);
            expect(next.mock.calls[0][0].code).toEqual('MVT0' + (index + 1)); // remove this line.
          });
        });
      });
      describe('when payload is not valid', () => {
        let secret:string = process.env.JWT_SECRET as string;

        [
          {
            title: 'and token does not have valid sub value',
            token: `Bearer ${jsonwebtoken.sign({ name: 'norman' }, secret)}`
          },
          {
            title: 'and token does not have valid roles value',
            token: `Bearer ${jsonwebtoken.sign({ sub: 'norman' }, secret)}`
          },
          {
            title: 'and token does not have valid permissions value',
            token: `Bearer ${jsonwebtoken.sign({ sub: 'norman', roles: [] }, secret)}`
          }
        ].forEach(({ title, token }, index) => {
          it(title, () => {
            // Arrange:
            let req = { url: '/orders/123', headers: { authorization: token } };
            let res = {};
            let next = jest.fn();
            let middleware = middlewares.validateToken(jsonwebtoken);

            // Act:
            middleware(req as any, res as any, next);

            // Assert:
            expect(next.mock.calls[0][0].message).toEqual('Unauthorized');
            expect(next.mock.calls[0][0].status).toEqual(401);
            // remove this line or your tests will behave kinda brittle.
            expect(next.mock.calls[0][0].code).toEqual('MVT0' + (4 + (index + 1)));
          });
        });
      });
    });
  });
  describe('input', () => {
    describe('validateInput', () => {
      it('should be a function', () => {
        expect(middlewares.validateInput).toBeFunction();
      });
      it('should return a function after invocation', async () => {
        // Arrange:

        let schema = new Datalizer({
          name: {
            $type: 'string',
            $max: 20,
            $empty: false,
            $min: 2
          }
        });

        // Act:
        let middleware = middlewares.validateInput(schema);

        // Assert:
        expect(middleware).toBeFunction();
      });
      it('should call next with error when validation fail', async () => {
        // Arrange:
        let middleware = middlewares.validateInput(new Datalizer({
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
        await middleware(req as any, res as any, next);

        // Assert:
        expect(next.mock.calls[0][0].name).toEqual('DatalizerValidationError');
        expect(next.mock.calls[0][0].message).toEqual('Validation failed');
        expect(next.mock.calls[0][0].errors).toBeArray().not.toBeEmpty();
        expect(next.mock.calls[0][0].errors[0].message).toEqual('{name} - min chars allowed is 2, but got 1.');
      });
      it('should call next without error when validation pass', async () => {
        // Arrange:
        let middleware = middlewares.validateInput(new Datalizer({
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
        await middleware(req as any, res as any, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
    });
  });
  describe('rights', () => {
    describe('validateRights', () => {
      it('should be a function', () => {
        expect(middlewares.validateRights).toBeFunction();
      });
      it('should return a function middleware after invocation', async () => {
        // Arrange:
        let permission = 'create order';

        // Act:
        let middleware = middlewares.validateRights(permission);

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
        let middleware = middlewares.validateRights('create order');

        // Act:
        await middleware(req as any, res as any, next);

        // Assert:
        expect(next.mock.calls[0][0].name).toEqual('Error');
        expect(next.mock.calls[0][0].message).toEqual('Forbidden');
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
        let middleware = middlewares.validateRights('cancel order');

        // Act:
        await middleware(req as any, res as any, next);

        // Assert:
        expect(next.mock.calls[0]).toBeArray().toBeEmpty();
      });
    });
  });
});
