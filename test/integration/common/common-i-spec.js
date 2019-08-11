import jsonwebtoken from 'jsonwebtoken';
import supertest from 'supertest';
import setup from '../index.js'; // Pending
import app from 'src/app.js';
import uuid from 'uuid/v4';

describe('Common cases:', () => {

  it(`should return error when token was not found`, async () => {
    // Given:
    let urls = [ '/nfkjdnfkjdnf', '/api', '/' ];

    for (let url of urls) {
      // When:
      let res = await supertest(app)
        .get(url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      // Then:
      expect(res.type).toBe('application/json');
      expect(res.body.error).toBeDefined();
      expect(res.statusCode).toBe(401);
    }
  });

  it('should return error when token sent is malformed', async () => {
    // Given:
    let tokens = [ 'mmm', 'Bearer ', 'Bearer kdjfnkjnkfjndkfjndkjfn' ];

    for (let token of tokens) {
      // When:
      let res = await supertest(app)
        .get(`/v1/binngo`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('authorization', token);

      // Then:
      expect(res.type).toBe('application/json');
      expect(res.body.error).toBeDefined();
      expect(res.statusCode).toBe(401);
    }
  });

  it('should return error when token invalid subject', async () => {
    // Given:
    let payload = { bingo: true };
    let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    // When:
    let res = await supertest(app)
      .get(`/v1/hi`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(401);
  });

  it('should return error when token invalid roles', async () => {
    // Given:
    let payload = { sub: uuid(), bingo: true, roles: null };
    let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    // When:
    let res = await supertest(app)
      .get(`/v1/hi`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(401);
  });

  it('should return error when token invalid permissions', async () => {
    // Given:
    let payload = { sub: uuid(), bingo: true, roles: [], permissions: null };
    let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    // When:
    let res = await supertest(app)
      .get(`/v1/hi`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(401);
  });

  it('should return error when token valid but path not found', async () => {
    // Given:
    let payload = { sub: uuid(), bingo: true, roles: [], permissions: [] };
    let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    // When:
    let res = await supertest(app)
      .get(`/v1/hi`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(404);
  });

  it(`should return error when method is not allowed on an endpoint`, async () => {
    // Given:
    let url = `/v1/auth/signin`;

    // When:
    let res = await supertest(app)
      .delete(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(405);
  });

  it('should return error only with code, message and status keys in production', async () => {
    // Mock:
    let backup = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Given:
    let payload = { sub: uuid(), bingo: true, roles: [], permissions: [] };
    let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);

    // When:
    let res = await supertest(app)
      .get(`/v1/auth/hi`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`);

    // Then:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toContainAllKeys([ 'message', 'code', 'status' ]);

    // Clean:
    process.env.NODE_ENV = backup;
  });

  it('should return error 502 when database is down.', async () => {
    // Setup:
    jest.spyOn(setup.models.Category, 'findAll').mockImplementation(
      async options => {
        let error = new Error('read ECONNRESET');
        error.name = 'SequelizeConnectionError';
        throw error;
      }
    );

    // Arrange:
    let permissions = [ 'get categories' ];

    // Act:
    let res = await supertest(app)
      .get(`/v1/categories`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${setup.genToken({ permissions })}`);

    // Assert:
    expect(res.type).toBe('application/json');
    expect(res.statusCode).toBe(502);
    expect(res.body.error).toBeDefined();

    // TearDown:
    setup.models.Category.findAll.mockRestore();
  });

  it('should log request when is rejected', async () => {
    // Setup:
    let backup = process.env.LOG_ENABLED;
    process.env.LOG_ENABLED = 'true';

    // Arrange:
    let url = `/v1/auth/signin`;

    // Act:
    let res = await supertest(app)
      .delete(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Assert:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(405);

    // TearDown:
    process.env.LOG_ENABLED = backup;
  });

  it('should log request when is resolved', async () => {
    // Setup:
    let backup = process.env.LOG_ENABLED;
    process.env.LOG_ENABLED = 'true';

    await setup.beforeAll();
    await setup.buildModels();

    if (setup.is_mocked) {
      jest.spyOn(setup.models.Category, 'findAll').mockImplementation(
        async options => [ setup.data.category[0] ]
      );
    }

    // Arrange:
    let permissions = [ 'get categories' ];

    // Act:
    let res = await supertest(app)
      .get(`/v1/categories`)
      .query({ limit: 2 })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${setup.genToken({ permissions })}`);

    // Assert:
    expect(res.type).toBe('application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();

    // TearDown:
    if (setup.is_mocked) {
      setup.models.Category.findAll.mockRestore();
    } else {
      await setup.afterEach();
    }
    process.env.LOG_ENABLED = backup;
  });

  it('should log request when level error is used.', async () => {
    // Setup:
    let backup = process.env.LOG_ENABLED;
    process.env.LOG_ENABLED = 'true';
    jest.spyOn(setup.models.Category, 'findAll').mockImplementation(
      async options => {
        throw new Error('error mocked.');
      }
    );

    // Arrange:
    let permissions = [ 'get categories' ];

    // Act:
    let res = await supertest(app)
      .get(`/v1/categories`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${setup.genToken({ permissions })}`);

    // Assert:
    expect(res.type).toBe('application/json');
    expect(res.body.error).toBeDefined();
    expect(res.statusCode).toBe(500);

    // TearDown:
    process.env.LOG_ENABLED = backup;
    setup.models.Category.findAll.mockRestore();
  });

});
