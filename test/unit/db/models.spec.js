import db from 'src/db/models';

describe("db/models/index.js", () => {
  it("expect db to be defined as an object", () => {
    expect(db).toBeDefined().toBeObject();
  });
  it("expect db.sync to be defined as a function", () => {
    expect(db.sync).toBeDefined().toBeFunction();
  });
  it("expect db.close to be defined as a function", () => {
    expect(db.close).toBeDefined().toBeFunction();
  });
  it('expect to resolve a promise when db.sync is invoked', () => {
    expect(db.sync()).toResolve();
  });
  it("expect undefined when db.close is invoked and db.sequelize is not defined", () => {
    db.sequelize = undefined;
    expect(db.close()).resolves.toBeUndefined();
  });
  it("expect undefined when db.close is invoked and db.sequelize is defined", () => {
    db.sequelize = { close: jest.fn(() => Promise.resolve()) };
    expect(db.close()).resolves.toBeUndefined();
  });
});
