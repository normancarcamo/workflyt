describe('app.js', () => {
  beforeAll(() => {
    const { default: db } = require('src/db/models');
    db.sequelize = { models: {}};
  })
  it('should export an express instance', () => {
    const { default: app } = require('src/app');
    expect(app).toBeFunction();
    expect(app.constructor.name).toBe('EventEmitter');
    expect(app.get('x-powered-by')).toBe(false);
  });
});
