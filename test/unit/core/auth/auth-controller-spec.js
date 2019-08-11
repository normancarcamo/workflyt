const Controller = require('src/core/auth/auth-controller');

describe('Controller', () => {
  it('should module be a factory function', () => {
    expect(Controller).toBeFunction();
  });
  it('should return an object when function is invoked', () => {
    expect(Controller({}))
      .toBeObject()
      .not.toBeEmpty()
      .toContainAllKeys([ 'signIn', 'signUp' ]);
  });

  describe('signIn', () => {
    it('should be a function', () => {
      expect(Controller().signIn).toBeFunction();
    });
    it('should return Promise when is executed', () => {
      expect(Controller().signIn()).toBePromise().toReject();
    });
    it('should return error when the service is not valid', () => {
      expect(Controller().signIn()).toBePromise().toReject();
      expect(Controller({}).signIn()).toBePromise().toReject();
    });
    it('should return error when arguments are valid', () => {
      // Given:
      let service = { signIn: request => {} };
      let arr = [ [], [ null, null, null ], [ null, {}, {} ] ];

      for (let args of arr) {
        // When:
        let result = Controller(service).signIn.apply(service, args);

        // Then:
        expect(result).toBePromise().toReject();
      }
    });
    it('should be resolved with error when service action fails', async () => {
      // Given:
      let service = {
        signIn: () => {
          return Promise.resolve({
            success: false,
            error: new Error('ennnnn')
          });
        }
      };
      let request = {};
      let response = {};
      let next = jest.fn();

      // When:
      let result = await Controller(service).signIn(request, response, next);

      // Then:
      expect(next).toBeCalled();
    });
    it('should be resolved with data when service action not fail', async () => {
      // Given:
      let service = {
        signIn: () => Promise.resolve({
          success: true,
          data: 'dsnkdjndksjnsf.dskjnfsdkjnfdskjdnf.ksdjnfksdjnf'
        })
      };
      let json = jest.fn();
      let request = {};
      let response = { json };
      let next = jest.fn();

      // When:
      let result = await Controller(service).signIn(request, response, next);

      // Then:
      expect(json).toBeCalled();
    });
  });

  describe('signUp', () => {
    it('should be a function', () => {
      expect(Controller().signUp).toBeFunction();
    });
    it('should return Promise when is executed', () => {
      expect(Controller().signUp()).toBePromise().toReject();
    });
    it('should return error when the service is not valid', () => {
      expect(Controller().signUp()).toBePromise().toReject();
      expect(Controller({}).signUp()).toBePromise().toReject();
    });
    it('should return error when arguments are valid', () => {
      // Given:
      let service = { signUp: request => {} };
      let arr = [ [], [ null, null, null ], [ null, {}, {} ] ];

      for (let args of arr) {
        // When:
        let result = Controller(service).signUp.apply(service, args);

        // Then:
        expect(result).toBePromise().toReject();
      }
    });
    it('should be resolved with error when service action fails', async () => {
      // Given:
      let service = {
        signUp: () => {
          return Promise.resolve({
            success: false,
            error: new Error('ennnnn')
          });
        }
      };
      let request = {};
      let response = {};
      let next = jest.fn();

      // When:
      let result = await Controller(service).signUp(request, response, next);

      // Then:
      expect(next).toBeCalled();
    });
    it('should be resolved with data when service action not fail', async () => {
      // Given:
      let service = {
        signUp: () => Promise.resolve({
          success: true,
          data: 'dsnkdjndksjnsf.dskjnfsdkjnfdskjdnf.ksdjnfksdjnf'
        })
      };
      let request = {};
      let response = {};
      let next = jest.fn();
      let json = jest.fn();
      let status = jest.fn(n => response);
      response.json = json;
      response.status = status;

      // When:
      let result = await Controller(service).signUp(request, response, next);

      // Then:
      expect(json).toBeCalled();
      expect(status).toBeCalledWith(201);
    });
  });
});
