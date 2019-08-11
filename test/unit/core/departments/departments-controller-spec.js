const Controller = require('src/core/departments/departments-controller');

const useCases = [
  'getDepartments',
  'createDepartments',
  'getDepartment',
  'updateDepartment',
  'deleteDepartment',
  'getEmployees',
  'addEmployees',
  'getEmployee',
  'updateEmployee',
  'removeEmployee'
];

describe('Controller', () => {
  it('should module be a factory function', () => {
    expect(Controller).toBeFunction();
  });
  it('should return an object when function is invoked', () => {
    expect(Controller({}))
      .toBeObject()
      .not.toBeEmpty()
      .toContainAllKeys(useCases);
  });

  useCases.forEach(useCase => {
    describe(useCase, () => {
      it('should be a function', () => {
        expect(Controller()[useCase]).toBeFunction();
      });
      it('should return Promise when is executed', () => {
        expect(Controller()[useCase]()).toBePromise().toReject();
      });
      it('should return error when the service is not valid', () => {
        expect(Controller()[useCase]()).toBePromise().toReject();
        expect(Controller({})[useCase]()).toBePromise().toReject();
      });
      it('should return error when arguments are valid', () => {
        // Given:
        let service = { [useCase]: request => {} };
        let arr = [ [], [ null, null, null ], [ null, {}, {} ] ];

        for (let args of arr) {
          // When:
          let result = Controller(service)[useCase].apply(service, args);

          // Then:
          expect(result).toBePromise().toReject();
        }
      });
      it('should be resolved with error when service action fails', async () => {
        // Given:
        let service = {
          [useCase]: () => {
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
        let result = await Controller(service)[useCase](request, response, next);

        // Then:
        expect(next).toBeCalled();
      });
      it('should be resolved with data when service action not fail', async () => {
        // Given:
        let service = {
          [useCase]: () => Promise.resolve({
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
        let result = await Controller(service)[useCase](request, response, next);

        // Then:
        expect(json).toBeCalled();
      });
    });
  });
});
