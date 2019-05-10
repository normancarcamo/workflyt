import db from 'src/db/models';
import Methods from 'src/db/methods/shared';
import { is } from '@playscode/fns';

describe("shared methods", () => {
  let Model;

  beforeAll(db.sync);

  beforeEach(() => {
    Model = db.sequelize.define('test', {}, {});
    Methods.call(Model, db.sequelize);
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
        .spyOn(Model, fn)
        .mockImplementation(() => Promise.resolve());
    });
  });

  it("findMany", () => {
    expect(is.promise(Model.findMany([]))).toBe(true)
    expect(is.promise(Model.findMany())).toBe(true)
  });

  it("createMany", () => {
    expect(is.promise(Model.createMany([]))).toBe(true)
    expect(is.promise(Model.createMany())).toBe(true)
  });

  it("updateMany", () => {
    expect(is.promise(Model.updateMany({}, []))).toBe(true)
    expect(is.promise(Model.updateMany({}, 'kdnkdfn'))).toBe(true)
  });

  it("destroyMany", () => {
    expect(is.promise(Model.destroyMany([]))).toBe(true)
    expect(is.promise(Model.destroyMany('kdnkdfn'))).toBe(true)
  });

  afterEach(() => {
    [
      'findAll',
      'create',
      'bulkCreate',
      'update',
      'destroy',
      'findByPk',
      'match',
      'findMany',
      'createMany',
      'updateMany',
      'destroyMany'
    ].forEach(fn => {
      if (jest.isMockFunction(Model[fn])) {
        Model[fn].mockRestore();
      }
    });
  })

  afterAll(db.close);
});
