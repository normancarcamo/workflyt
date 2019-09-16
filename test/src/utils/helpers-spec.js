const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  onServerListen,
  onServerError,
  onServerClose,
  onProcessStop,
  onProcessError,
  signToken,
  comparePassword,
  hashPassword
} = require('src/utils/helpers');

describe('helpers.js', () => {
  let PORT = null;
  let HOST = null;
  let logger = null;
  let http = null;
  let app = null;
  let database = null;

  beforeEach(() => {
    http = {
      createServer: jest.fn(x => ({
        listen: jest.fn((p, h, callback) => {
          if (callback) {
            callback();
          }
        }),
        on: jest.fn((message, callback) => {
          if (callback) {
            callback();
          }
        }),
        close: jest.fn(cb => cb()),
        listening: true
      }))
    };
    PORT = 3000;
    HOST = '127.0.0.1';
    logger = { info: () => {}, error: () => {} };
    database = require('test/config/database');
    app = function (req, res, next) {};
  });

  describe('onServerListen', () => {
    describe('should start listening to a http server', () => {
      it('should connect to the database', (done) => {
        jest.spyOn(logger, 'info').mockImplementation(jest.fn);
        http.createServer(app).listen(PORT, HOST, onServerListen(logger, database, () => {
          expect(logger.info.mock.calls[0][0]).toBe('Server is connected.');
          expect(logger.info.mock.calls[1][0]).toBe('Database is connected.');
          done();
        }));
      });
      it('should log error when cannot connect to the database', (done) => {
        jest.spyOn(database.sequelize, 'authenticate').mockRejectedValue(new Error('ouch'));
        jest.spyOn(logger, 'info').mockImplementation(jest.fn);
        jest.spyOn(logger, 'error').mockImplementation(jest.fn);
        http.createServer(app).listen(PORT, HOST, onServerListen(logger, database, () => {
          expect(logger.info.mock.calls[0][0]).toBe('Server is connected.');
          expect(logger.error.mock.calls[0][1]).toBe('Unable to connect to the database.');
          done();
        }));
      });
    });
  });

  describe('onServerError', () => {
    it('should restart server when address is in use', () => {
      // Arrange:
      let exec = jest.fn();
      let server = {
        on: (message, callback) => {
          if (callback) {
            let error = new Error('EADDRINUSE');
            error.code = 'EADDRINUSE';
            callback(error);
          }
        }
      };

      // Act:
      server.on('error', onServerError(logger, exec));

      // Assert:
      expect(exec).toHaveBeenCalledWith('sh nodemon.sh');
      expect(logger.error.mock).toBe(undefined);
    });
    it('should log error', () => {
      // Arrange:
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      let exec = jest.fn();
      let server = {
        on: (message, callback) => {
          if (callback) {
            let error = new Error('Unknown Error');
            error.code = 'WHOKNOWS';
            callback(error);
          }
        }
      };

      // Act:
      server.on('error', onServerError(logger, exec));

      // Assert:
      expect(logger.error.mock.calls[0][1]).toEqual('Unknown Error');
      expect(logger.error.mock.calls[0][0].err.code).toEqual('WHOKNOWS');
    });
  });

  describe('onServerClose', () => {
    let server = null;

    beforeEach(() => {
      server = http.createServer(app);
    });

    it('should log error when tried to close the server connection', (done) => {
      // Arrange:
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      jest.spyOn(server, 'close').mockImplementation(cb => cb(new Error('unknown error')));

      // Act:
      server.close(onServerClose(logger, database, () => {

        // Assert:
        expect(logger.error.mock.calls[0][1]).toEqual('unknown error');
        done();
      }));
    });
    it('should log "Server is now closed."', (done) => {
      // Arrange:
      jest.spyOn(logger, 'info').mockImplementation(jest.fn);

      // Act:
      server.close(onServerClose(logger, database, () => {

        // Assert:
        expect(logger.info.mock.calls[0][0]).toEqual('Server is now closed.');
        done();
      }));
    });
    it('should log "Database is now closed."', (done) => {
      // Arrange:
      jest.spyOn(database.sequelize, 'close').mockResolvedValue();
      jest.spyOn(logger, 'info').mockImplementation(jest.fn);
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);

      // Act:
      server.close(onServerClose(logger, database, () => {

        // Assert:
        expect(logger.info.mock.calls[1][0]).toEqual('Database is now closed.');
        done();
      }));
    });
    it('should log error when database close action fail', (done) => {
      // Arrange:
      jest.spyOn(database.sequelize, 'close').mockRejectedValue(new Error('Unknown error'));
      jest.spyOn(logger, 'info').mockImplementation(jest.fn);
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);

      // Act:
      server.close(onServerClose(logger, database, () => {

        // Assert:
        expect(logger.error.mock.calls[0][1]).toEqual('Unknown error');
        done();
      }));
    });
  });

  describe('onProcessStop', () => {
    it('should return a function after invokation', () => {
      // Arrange:
      let server = http.createServer(app);

      // Act:
      let callback = onProcessStop(server, logger, database);

      // Assert:
      expect(callback).toBeFunction();
    });
    it('should close a server listening', (done) => {
      // Arrange:
      let server = http.createServer(app);

      // Act:
      onProcessStop(server, logger, database, () => {

        // Assert
        expect(server.listening).toBe(false);
        done();
      })();
    });
    it('should not close a server that is not listening', (done) => {
      // Arrange:
      let server = http.createServer(app);
      server.listening = false;

      // Act:
      onProcessStop(server, logger, database, () => {

        // Assert
        expect(server.listening).toBe(false);
        done();
      })();
    });
  });

  describe('onProcessError', () => {
    it('should return a function callback after invokation', () => {
      // Arrange:
      let server = http.createServer(app);

      // Act:
      let callback = onProcessError(logger);

      // Assert:
      expect(callback).toBeFunction();
    });
    it('should function callback log error after invokation', () => {
      // Arrange:
      jest.spyOn(logger, 'error').mockImplementation(jest.fn);
      let server = http.createServer(app);

      // Act:
      onProcessError(logger)(new Error('ouch'));

      // Assert:
      expect(logger.error.mock.calls[0][1]).toEqual('ouch');
    });
  });

  describe('signToken', () => {
    it('should be a function', () => {
      expect(signToken).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      [ // Arrange:
        null,
        undefined,
        1,
        0,
        -2,
        "",
        [],
        {},
        { action: '' },
        { action: {} },
        { action: 1 },
        { action: true },
      ].forEach(useCase => {
        // Act:
        let result = x => signToken(useCase);

        // Assert:
        expect(result).toThrow();
      });
    });
    it('should throw error during the signing of the token', async () => {
      // Setup:
      jest.spyOn(jsonwebtoken, 'sign').mockImplementation((p, s) => {
        throw new Error('ouch');
      });

      // Arrange:
      let input = { payload: 'bbb', secret: 10 };

      // Act:
      let result = x => signToken(input);

      // Assert:
      expect(result).toThrow('ouch');

      // TearDown:
      jsonwebtoken.sign.mockRestore();
    });
    it('should return hash when is executed', async () => {
      // Arrange:
      let input = { payload: { sub: 9238749238 }, secret: 'makdm2kms' };

      // Act:
      let result = signToken(input);

      // Assert:
      expect(result).toBeString().not.toBeEmpty().toIncludeRepeated(/\./, 2);
      expect(result.split('.')).toBeArray().not.toBeEmpty().toHaveLength(3);
      expect(result.length).toSatisfy(n => n > 100);
    });
  });

  describe('comparePassword', () => {
    it('should be a function', () => {
      expect(comparePassword).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      [ // Arrange:
        null,
        undefined,
        1,
        0,
        -2,
        "",
        [],
        {},
        { action: '' },
        { action: {} },
        { action: 1 },
        { action: true },
      ].forEach(useCase => {
        // Act:
        let result = comparePassword(useCase);

        // Assert:
        expect(result).rejects.toThrow();
      });
    });
    it('should throw error during the comparison', async () => {
      // Setup:
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('ouch'));

      // Arrange:
      let input = { raw: 'bbb', hash: bcrypt.hashSync('aaa', 10) };

      // Act:
      let result = comparePassword(input);

      // Assert:
      expect(result).toReject('ouch');

      // TearDown:
      bcrypt.compare.mockRestore();
    });
    it('should throw error and return false when password does not match', async () => {
      // Arrange:
      let input = { raw: 'bbb', hash: bcrypt.hashSync('aaa', 10) };

      // Act:
      let result = comparePassword(input);

      // Assert:
      return result.catch(e => expect(e.message).toEqual('Forbidden.'));
    });
    it('should return true when password match', async () => {
      // Arrange:
      let input = { raw: 'aaa', hash: bcrypt.hashSync('aaa', 10) };

      // Act:
      let result = comparePassword(input);

      // Assert:
      return result.then(e => expect(e).toEqual(true));
    });
  });

  describe('hashPassword', () => {
    it('should be a function', () => {
      expect(hashPassword).toBeFunction();
    });
    it('should throw error when function input interface is not valid', () => {
      // Arrange:
      let useCases = [
        null,
        undefined,
        1,
        0,
        -2,
        "",
        [],
        {},
        { action: '' },
        { action: {} },
        { action: 1 },
        { action: true },
      ].forEach(useCase => {
        // Act:
        let result = hashPassword(useCase);

        // Assert:
        expect(result).rejects.toThrow();
      });
    });
    it('should throw error during the hashing', async () => {
      // Setup:
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('ouch'));

      // Arrange:
      let input = { password: 'bbb', salt: 10 };

      // Act:
      let result = hashPassword(input);

      // Assert:
      expect(result).rejects.toHaveProperty('status', 500);

      // TearDown:
      bcrypt.hash.mockRestore();
    });
    it('should return true when password match', async () => {
      // Arrange:
      let input = { password: 'aaa', salt: 10 };

      // Act:
      let result = await hashPassword(input);

      // Assert:
      expect(result).toBeString().not.toBeEmpty();
    });
  });
});
