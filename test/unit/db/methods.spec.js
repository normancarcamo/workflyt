import db from 'src/db/models';
import methods from 'src/db/methods';
import { is } from '@playscode/fns';

let Model;

// Specification:
describe("methods", () => {

  // Setup:
  beforeAll(db.sync);

  // Get the methods name of each model registered in src/db/methods:
  Object.keys(methods).forEach(methodFileName => {

    // Scenario:
    describe(methodFileName, () => {

      // Setup:
      beforeEach(() => {
        // The idea of a simple Model like this is to just get through prototype
        // the new methods registered, then we will use them in our test cases.
        Model = function() {};
        Model._name = methodFileName;
        methods[methodFileName].call(Model, db.sequelize);

        // Mock: db.sequelize.query fn.
        jest
          .spyOn(db.sequelize, 'query')
          .mockImplementation(() => Promise.resolve());

        // Mock the next functions: update, destroy, create, findAll, etc...
        // in all models:
        Object.keys(db.sequelize.models).forEach(modelName => {
          [
            "bulkCreate",
            "create",
            "update",
            "destroy",
            "findAll",
            "findByPk",
            "findOne"
          ].forEach(fn => {
            jest
              .spyOn(db.sequelize.models[modelName], fn)
              .mockImplementation(() => Promise.resolve());
          });
        });
      });

      // Case:
      it("expect the promise result to be resolved", () => {
        if (methodFileName === 'Item') {
          let proto = db.sequelize.models[methodFileName].prototype;
          jest.spyOn(proto, "setTypes").mockImplementation(() => {
            return Promise.resolve();
          });
        }

        Object.keys(Model.prototype).forEach(key => {

          // Given:
          let model = db.sequelize.models[methodFileName].build({});

          // When:

          let result = model[key]({}, {});

          // Then:
          expect(result).toBeInstanceOf(Promise);
        });
      });
    });
  });

  // TearDown:
  afterAll(db.close);
});
