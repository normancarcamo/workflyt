import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as helpers from '../../../src/utils/helpers';
import { Idatabase } from '../../../src/providers/postgres/types';
import { Server } from 'http';
import Pino, { Logger } from 'pino';
import Database from '../../config/database';
import { Handler } from 'express';

describe('helpers.js', () => {
  let PORT:number = 3000;
  let http:any;
  let database:Idatabase;
  let logger:Logger;
  let app:Handler = (req, res, next) => {};

  beforeEach(() => {
    let server = {
      listen: jest.fn((p, callback) => {
        if (callback) {
          callback();
        }
      }),
      on: jest.fn((message, callback) => {
        if (callback) {
          callback();
        }
      }),
      close: jest.fn(cb => {
        server.listening = false;
        cb();
      }),
      listening: true
    };
    http = { createServer: jest.fn(x => server) };
    logger = Pino({});
    database = <any>{ ...Database() };
  });

  describe('comparePassword', () => {
    it('should be a function', () => {
      expect(helpers.comparePassword).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      [
        [ null, 'ksjdnksjdnf' ],
        [ undefined, 'ksjdnksjdnf' ],
        [ 1, 'ksjdnksjdnf' ],
        [ 0, 'ksjdnksjdnf' ],
        [ -2, 'ksjdnksjdnf' ],
        [ "asda", 'ksjdnksjdnf' ],
        [ [], 'ksjdnksjdnf' ],
        [ {}, 'ksjdnksjdnf' ],
        [ { action: '' }, 'ksjdnksjdnf' ],
        [ { action: {} }, 'ksjdnksjdnf' ],
        [ { action: 1 }, 'ksjdnksjdnf' ],
        [ { action: true }, 'ksjdnksjdnf' ]
      ].forEach((input:any):void => {
        expect(helpers.comparePassword.apply(null, input)).toReject();
      });
    });
    it('should throw error during the comparison', async () => {
      // Setup:
      let spy = jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('ouch'));

      // Arrange:
      let input:[ string, string ] = [ 'bbb', bcrypt.hashSync('aaa', 10) ];

      // Act:
      let result = helpers.comparePassword.apply(null, input);

      // Assert:
      expect(result).rejects.toEqual(new Error('ouch'));

      // TearDown:
      spy.mockRestore();
    });
    it('should throw error and return false when password does not match', async () => {
      // Arrange:
      let input:[ string, string ] = [ 'bbb', bcrypt.hashSync('aaa', 10) ];

      // Act:
      let result = helpers.comparePassword.apply(null, input);

      // Assert:
      return result.catch(e => expect(e.message).toEqual('Forbidden.'));
    });
    it('should return true when password match', async () => {
      // Arrange:
      let input:[ string, string ] = [ 'aaa', bcrypt.hashSync('aaa', 10) ];

      // Act:
      let result = helpers.comparePassword.apply(null, input);

      // Assert:
      return result.then(e => expect(e).toEqual(true));
    });
  });

  describe('hashPassword', () => {
    it('should be a function', () => {
      expect(helpers.hashPassword).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      // Arrange:
      [
        [ null, 10 ],
        [ undefined, 10 ],
        [ 1, 10 ],
        [ 0, 10 ],
        [ -2, 10 ],
        [ [], 10 ],
        [ {}, 10 ],
        [ { action: '' }, 10 ],
        [ { action: {} }, 10 ],
        [ { action: 1 }, 10 ],
        [ { action: true }, 10 ],
      ].forEach((input:any):void => {
        expect(helpers.hashPassword.apply(null, input)).toReject();
      });
    });
    it('should throw error during the hashing', async () => {
      // Setup:
      let spy = jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('ouch'));

      // Arrange:
      let input:[ string, number ] = [ 'bbb', 10 ];

      // Act:
      let result = helpers.hashPassword.apply(null, input);

      // Assert:
      expect(result).rejects.toEqual(new Error('ouch'));

      // TearDown:
      spy.mockRestore();
    });
    it('should return true when password match', async () => {
      // Arrange:
      let input:[ string, number ] = [ 'bbb', 10 ];

      // Act:
      let result = await helpers.hashPassword.apply(null, input);

      // Assert:
      expect(result).toBeString().not.toBeEmpty();
    });
  });

  describe('signToken', () => {
    it('should be a function', () => {
      expect(helpers.signToken).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      // Arrange:
      [
        [ null, 'ksjdnksjdnf' ],
        [ undefined, 'ksjdnksjdnf' ],
        [ [], 'ksjdnksjdnf' ]
      ].forEach((input:any):void => {
        // Act:
        let result = () => helpers.signToken.apply(null, input);

        // Assert:
        expect(result).toThrow();
      });
    });
    it('should throw error during the signing of the token', async () => {
      // Setup:
      let spy = jest.spyOn(jsonwebtoken, 'sign').mockImplementation((p, s) => {
        throw new Error('ouch');
      });

      // Arrange:
      let input:[ string, any ] = [ 'bbb', null ];

      // Act:
      let result = () => helpers.signToken.apply(null, input);

      // Assert:
      expect(result).toThrow('ouch');

      // TearDown:
      spy.mockRestore();
    });
    it('should return hash when is executed', async () => {
      // Arrange:
      let input:[ object, string ] = [ { sub: 9238749238 }, 'makdm2kms' ];

      // Act:
      let result = helpers.signToken.apply(null, input);

      // Assert:
      expect(result).toBeJsonWebToken();
    });
  });

  describe('onServerListen', () => {
    describe('should start listening to a http server', () => {
      it('should connect to the database', (done) => {
        let spy = jest.spyOn(logger, 'info').mockImplementation(jest.fn);
        let server = http.createServer(app);
        let callback = helpers.onServerListen(logger, database, () => {
          expect(spy.mock.calls[0][0]).toBe('Server is connected.');
          expect(spy.mock.calls[1][0]).toBe('Database is connected.');
          done();
        });
        server.listen(PORT, callback);
      });
      it('should log error when cannot connect to the database', (done) => {
        let spyDBAuthenticate = jest.spyOn(database.sequelize, 'authenticate');
        let spyLoggerInfo = jest.spyOn(logger, 'info');
        let spyLoggerError = jest.spyOn(logger, 'error');

        spyDBAuthenticate.mockRejectedValue(new Error('ouch'));
        spyLoggerInfo.mockImplementation(jest.fn);
        spyLoggerError.mockImplementation(jest.fn);

        let server = http.createServer(app);

        let callback = helpers.onServerListen(logger, database, () => {
          expect(spyLoggerInfo.mock.calls[0][0]).toBe('Server is connected.');
          expect(spyLoggerError.mock.calls[0][1]).toBe('Unable to connect to the database.');
          expect(spyDBAuthenticate.mock.calls.length).toEqual(1);
          done();
        });

        server.listen(PORT, callback);
      });
    });
  });

  describe('onServerError', () => {
    it('should restart server when address is in use', () => {
      // Arrange:
      let spy = jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      let exec = jest.fn();
      let server = {
        on: (message:any, callback:(x:any) => void) => {
          if (callback) {
            let error = new Error('EADDRINUSE') as any;
            error.code = 'EADDRINUSE';
            callback(error);
          }
        }
      };

      // Act:
      server.on('error', helpers.onServerError(logger, exec));

      // Assert:
      expect(exec).toHaveBeenCalledWith('sh nodemon.sh');
      expect(spy).not.toBeCalled();
    });
    it('should log error', () => {
      // Arrange:
      let spyLoggerError:any = jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      let exec = jest.fn();
      let server = {
        on: (message:any, callback:(x:any) => void) => {
          if (callback) {
            let error = new Error('Unknown Error') as any;
            error.code = 'WHOKNOWS';
            callback(error);
          }
        }
      };

      // Act:
      server.on('error', helpers.onServerError(logger, exec));

      // Assert:
      expect(spyLoggerError.mock.calls[0][1]).toEqual('Unknown Error');
      expect(spyLoggerError.mock.calls[0][0].err.code).toEqual('WHOKNOWS');
    });
  });

  describe('onServerClose', () => {
    let server:Server;

    beforeEach(() => {
      server = http.createServer(app);
    });

    it('should log error when tried to close the server connection', (done) => {
      let spyLoggerError = jest.spyOn(logger, 'error');
      let spyServer = jest.spyOn(server, 'close');

      // Arrange:
      spyLoggerError.mockImplementation(jest.fn);
      spyServer.mockImplementation((cb:any) => cb(new Error('unknown error')));

      // Act:
      server.close(helpers.onServerClose(logger, database, () => {

        // Assert:
        expect(spyLoggerError).toHaveBeenCalled();
        expect(spyLoggerError.mock.calls[0][1]).toEqual('unknown error');
        done();
      }));
    });
    it('should log "Server is now closed."', (done) => {
      // Arrange:
      let spyLoggerInfo = jest.spyOn(logger, 'info');
      spyLoggerInfo.mockImplementation(jest.fn);

      // Act:
      server.close(helpers.onServerClose(logger, database, () => {

        // Assert:
        expect(spyLoggerInfo.mock.calls[0][0]).toEqual('Server is now closed.');
        done();
      }));
    });
    it('should log "Database is now closed."', (done) => {
      let spyDBClose:any = jest.spyOn(database.sequelize, 'close');
      let spyLoggerInfo = jest.spyOn(logger, 'info');

      // Arrange:
      spyDBClose.mockResolvedValue({});
      spyLoggerInfo.mockImplementation(jest.fn);

      // Act:
      server.close(helpers.onServerClose(logger, database, () => {

        // Assert:
        expect(spyLoggerInfo.mock.calls[1][0]).toEqual('Database is now closed.');
        expect(spyDBClose).toBeCalledTimes(1);
        done();
      }));
    });
    it('should log error when database close action fail', (done) => {
      let spyDBClose = jest.spyOn(database.sequelize, 'close');
      let spyLoggerInfo = jest.spyOn(logger, 'info');
      let spyLoggerError = jest.spyOn(logger, 'error');

      // Arrange:
      spyDBClose.mockRejectedValue(new Error('Unknown error'));
      spyLoggerInfo.mockImplementation(jest.fn);
      spyLoggerError.mockImplementation(jest.fn);

      // Act:
      server.close(helpers.onServerClose(logger, database, () => {

        // Assert:
        expect(spyDBClose).toBeCalledTimes(1);
        expect(spyLoggerInfo.mock.calls[0][0]).toEqual('Server is now closed.');
        expect(spyLoggerError.mock.calls[0][1]).toEqual('Unknown error');
        done();
      }));
    });
  });

  describe('onProcessStop', () => {
    it('should return a function after invokation', () => {
      // Arrange:
      let server = http.createServer(app);

      // Act:
      let callback = helpers.onProcessStop(server, logger, database);

      // Assert:
      expect(callback).toBeFunction();
    });
    it('should close a server listening', (done) => {
      // Arrange:
      let spyLoggerInfo = jest.spyOn(logger, 'info').mockImplementation(jest.fn);
      let server = http.createServer(app);

      // Act:
      helpers.onProcessStop(server, logger, database, () => {

        // Assert
        expect(server.listening).toBe(false);
        expect(spyLoggerInfo).toHaveBeenCalledTimes(2);
        done();
      })();
    });
    it('should not close a server that is not listening', (done) => {
      // Arrange:
      let server = http.createServer(app);
      server.listening = false;

      // Act:
      helpers.onProcessStop(server, logger, database, () => {

        // Assert
        expect(server.listening).toBe(false);
        done();
      })();
    });
  });

  describe('onProcessError', () => {
    it('should return a function callback after invokation', () => {
      // Act:
      let callback = helpers.onProcessError(logger);

      // Assert:
      expect(callback).toBeFunction();
    });
    it('should function callback log error after invokation', () => {
      // Arrange:
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      let spyLoggerError = jest.spyOn(logger, 'error').mockImplementation(jest.fn);

      // Act:
      helpers.onProcessError(logger)(new Error('ouch'));

      // Assert:
      expect(spyLoggerError.mock.calls[0][1]).toEqual('ouch');
    });
  });
});
