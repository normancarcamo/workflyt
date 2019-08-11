const supertest = require('supertest');
const setup = require('../index.js').default;
const API_BASE = '/v1/items';
const mocks = require('./items-mocks');

describe('Item Service:', () => {
  beforeAll(setup.beforeAll);
  beforeEach(async () => {
    await setup.beforeEach();
    jest.unmock('src/core/items/items-repository');
  });

  // Items --------------------------------------------------------------------

  describe('get items:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'ddkdmkdmdkmd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H01-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items' ];
      let payload = [
        [ 1, { search: null } ],
        [ 2, { id: 22324 } ]
      ];

      for (let [ id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H01-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
      // Setup:
      mocks.asError({ findAll: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items' ];
      let options = { name: 'bbbbb' };

      // Act:
      let res = await supertest(app)
        .get(API_BASE)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H01-02');
    });
    it(`should return status 200 get items were filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.itemsAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get items' ];
      let payload = [
        [ 1, {} ],
        [ 2, { limit: 2 } ],
        [ 3, { offset: 1, limit: 1 } ],
        [ 4, { sort_by: 'name' } ],
        [ 5, { sort_by: 'name', order_by: 'desc' } ],
        [ 6, { limit: 1, attributes: [ 'id', 'code', 'name' ] } ],
        [ 7, { limit: 1, attributes: 'id,code,name' } ],
        [ 8, { limit: 1, include: 'stocks' } ],
        [ 9, { limit: 1, include: ['stocks'] } ],
        [ 10, { order_by: 'asc' } ],
        [ 11, { order_by: 'desc' } ],
        [ 12, { category_id: setup.instance.categories[0].id } ],
        [ 13, { category_id: setup.instance.categories[1].id } ],
        [ 14, { name: 'Banner design' } ],
        [ 15, { name: { like: '%design%' } } ],
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(API_BASE)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if (id === 1) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 2) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(2);
        }
        if (id === 3) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
        }
        if (id === 4) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Banner design');
          expect(res.body.data[1].name).toBe('Logo design');
        }
        if (id === 5) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Stickers design');
          expect(res.body.data[1].name).toBe('Sign for traffic 4x24');
        }
        if (id === 6 || id === 7) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0]).toContainAllKeys([ 'id', 'name', 'code' ]);
        }
        if (id === 8 || id === 9) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].stocks).toBeArray().not.toBeEmpty();
        }
        if (id === 10 || id === 11) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Logo design');
          expect(res.body.data[1].name).toBe('Sign for traffic 4x24');
          expect(res.body.data[2].name).toBe('Stickers design');
          expect(res.body.data[3].name).toBe('Banner design');
        }
        if (id === 12) {
          expect(res.body.data).toBeEmpty();
        }
        if (id === 13) {
          expect(res.body.data).not.toBeEmpty();
        }
        if (id === 14) {
          expect(res.body.data).not.toBeEmpty().toHaveLength(1);
          expect(res.body.data[0]).toBeObject().not.toBeEmpty();
          expect(res.body.data[0].name).toBe('Banner design');
        }
        if (id === 15) {
          expect(res.body.data).not.toBeEmpty();
          expect(res.body.data).toHaveLength(3);
          for (let element of res.body.data) {
            expect(element).toBeObject().not.toBeEmpty();
            expect(element.name).toInclude('design');
          }
        }
      }
    });
  });

  describe('create item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdndknd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send({ name: 'ksnksnksnsk' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H02-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create items' ];
      let payload = [
        [ 1, { id: 24234234 } ],
        [ 2, { name: '' } ],
        [ 3, {} ]
      ];

      for (let [ id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(API_BASE)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H02-01');
      }
    });
    it(`should return status 500 when action is rejected`, async () => {
     // Setup:
     let cycle = { _id: null };

     if (setup.is_mocked) {
       mocks.createRepeatedError({ setup, cycle });
     }

     // Arrange:
     let app = require('src/app.js');
     let permissions = [ 'create items' ];
     let payload = [
       [ 1, { name: 'demo' } ],
       [ 2, { name: 'demo' } ],
     ];

     for (let [ id, data ] of payload) {
       cycle._id = id;

       // Act:
       let res = await supertest(app)
         .post(API_BASE)
         .send(data)
         .set('Content-Type', 'application/json')
         .set('Accept', 'application/json')
         .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

       // Assert:
       if (id === 1) {
         setup.assertOk(expect, res, 201);
       } else if (id === 2) {
         setup.assertError(expect, res, 500, 'C07H02-02');
       }
     }
    });
    it(`should return status 201 when item is created`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsCreated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'create items' ];

      // Act:
      let res = await supertest(app)
        .post(API_BASE)
        .send({ name: 'data cards 2x34' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 201);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.name).toBe('data cards 2x34');
    });
  });

  describe('get item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdnkdnkdnd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H03-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd', {} ],
        [ 2, '11', {} ],
        [ 3, '11', { attributes: 'nananana' } ],
      ];

      for (let [ id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H03-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item' ];
      let item_id = setup.instance.items[0].id;
      let options = {};

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H03-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item' ];
      let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H03-03');
    });
    it(`should return status 200 when item is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get item' ];
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(item_id);
    });
  });

  describe('update item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkdnkdndknd' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${setup.instance.items[0].id}`)
          .send({ name: 'sknsksnks' })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H04-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', { id: 23423423 } ],
        [ 2, '11bf5b37-e0', { name: '' } ],
        [ 3, setup.instance.items[0].id, {} ]
      ];

      for (let [ id, item_id, data ] of payload) {
        // Act:
        let res = await supertest(app)
          .put(`${API_BASE}/${item_id}`)
          .send(data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H04-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item' ];
      let item_id = setup.instance.items[0].id;
      let data = { name: 'Item A' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H04-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item' ];
      let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H04-03');
    });
    it(`should return status 500 when item tried to be updated`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, update: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item' ];
      let item_id = setup.instance.items[0].id;
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H04-04');
    });
    it(`should return status 200 when item is updated`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.itemIsUpdated({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'update item' ];
      let item_id = setup.instance.items[0].id;
      let data = { name: 'demo' };

      // Act:
      let res = await supertest(app)
        .put(`${API_BASE}/${item_id}`)
        .send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('delete item:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'kdnkdnkdnkdn' ] ]
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${item_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H05-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete item' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, '111s', {} ],
        [ 3, '111s', { force: 'naaaaaa' } ],
        [ 4, '111s', { paranoid: 'naaaaaa' } ]
      ];

      for (let [ id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H05-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete item' ];
      let item_id = setup.instance.items[0].id;
      let options = {};

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${item_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H05-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete item' ];
      let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let options = {};

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${item_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H05-03');
    });
    it(`should return status 500 when item tried to be deleted`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, destroy: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete item' ];
      let item_id = setup.instance.items[0].id;
      let options = {};

      // Act:
      let res = await supertest(app)
        .delete(`${API_BASE}/${item_id}`)
        .query(options)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H05-04');
    });
    it(`should return status 200 when item is deleted`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.itemIsDeleted({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'delete item' ];
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, {} ],
        [ 2, { paranoid: true } ],
        [ 3, { paranoid: false } ],
        [ 4, { force: true } ], // This one actually remove it from db.
        [ 5, { force: false } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .delete(`${API_BASE}/${item_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        if (id === 1) {
          setup.assertOk(expect, res, 200);
        } else {
          setup.assertError(expect, res, 404);
        }
      }
    });
  });

  // Stocks -------------------------------------------------------------------

  describe('get stocks:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let item_id = setup.instance.items[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkdnk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}/stocks`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H06-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks from item' ];
      let payload = [
        [ 1, '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s', {} ],
        [ 2, '1s', {} ],
        [ 3, setup.instance.items[0].id, { name: '' } ]
      ];

      for (let [ id, item_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}/stocks`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H06-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks from item' ];
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H06-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks from item' ];
      let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H06-03');
    });
    it(`should return status 500 when stocks tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getStocks: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks from item' ];
      let item_id = setup.instance.items[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H06-04');
    });
    it(`should return status 200 when stocks are filtered`, async () => {
      // Setup:
      let cycle = { _id: null };

      if (setup.is_mocked) {
        mocks.stocksAreFiltered({ setup, cycle });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stocks from item' ];
      let payload = [
        [ 1, {} ],
        [ 2, { attributes: [ 'id', 'entries' ] } ],
        [ 3, { attributes: 'id,entries' } ],
        [ 4, { exits: { gte: 400 }, attributes: [ 'id', 'exits' ] } ],
        [ 5, { entries: { gte: 400 } } ],
        [ 6, { entries: { gt: 400 } } ],
        [ 7, { stock: { lt: 400 } } ],
        [ 8, { stock: { lte: 400 } } ],
        [ 9, { stock: { between: [1, 100] } } ],
        [ 10, { created_at: { gt: '2019-01-01' } } ],
        [ 11, { created_at: { gte: '2019-01-01' } } ],
        [ 12, { created_at: { lt: '2919-01-01' } } ],
        [ 13, { created_at: { lte: '2919-01-01' } } ],
        [ 14, { created_at: { between: [ '2019-01-01', '2919-05-01' ] } } ],
        [ 15, { exits: { gt: 400 } } ],
        // empty:
        [ 16, { entries: { lt: 400 } } ],
        [ 17, { entries: { lte: 400 } } ],
        [ 18, { entries: { between: [1, 100] } } ],
        [ 19, { exits: 23 } ],
        [ 20, { exits: { lt: 400 } } ],
        [ 21, { exits: { lte: 400 } } ],
        [ 22, { exits: { between: [1, 100] } } ],
        [ 23, { stock: 23 } ],
        [ 24, { stock: { gt: 400 } } ],
        [ 25, { stock: { gte: 400 } } ],
        [ 26, { created_at: '2019-06-17 05:32:07.102' } ]
      ];

      for (let [ id, options ] of payload) {
        cycle._id = id;

        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${setup.instance.items[0].id}/stocks`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertOk(expect, res, 200);
        expect(res.body.data).toBeArray();

        if (id < 16) {
          expect(res.body.data).not.toBeEmpty();
          if ([2, 3].includes(id)) {
            for (let stock of res.body.data) {
              expect(stock).toContainAllKeys([ 'id', 'entries' ]);
            }
          }
          if (id === 4) {
            for (let stock of res.body.data) {
              expect(stock).toContainAllKeys([ 'id', 'exits' ]);
            }
          }
        } else {
          expect(res.body.data).toBeEmpty();
        }
      }
    }, 30000);
  });

  describe('add stocks:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let item_id = setup.instance.items[0].id;
      let stocks = setup.instance.stocks.map(e => e.id);
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dkndkdnk' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${item_id}/stocks`)
          .send({ stocks })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H07-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add stocks to item' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          setup.instance.stocks.slice(0, 2).map(e => e.id)
        ],
        [
          2,
          setup.instance.items[0].id,
          [
            '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
            '1ddgdg',
          ],
        ],
      ];

      for (let [ id, item_id, stocks ] of payload) {
        // Act:
        let res = await supertest(app)
          .post(`${API_BASE}/${item_id}/stocks`)
          .send({ stocks })
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H07-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add stocks to item' ];
      let item_id = setup.instance.items[0].id;
      let stocks = setup.instance.stocks.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${item_id}/stocks`)
        .send({ stocks })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H07-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add stocks to item' ];
      let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
      let stocks = setup.instance.stocks.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${item_id}/stocks`)
        .send({ stocks })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H07-03');
    });
    it(`should return status 500 when stocks tried to be added`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, addStocks: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add stocks to item' ];
      let item_id = setup.instance.items[0].id;
      let stocks = setup.instance.stocks.map(e => e.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${item_id}/stocks`)
        .send({ stocks })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H07-04');
    });
    it(`should return status 200 when stocks were added`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stocksAreAdded({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'add stocks to item' ];
      let item_id = setup.instance.items[0].id;
      let stocks = setup.instance.stocks.map(q => q.id);

      // Act:
      let res = await supertest(app)
        .post(`${API_BASE}/${item_id}/stocks`)
        .send({ stocks })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
    });
  });

  describe('get stock:', () => {
    it(`should return status 403 when access control is denied`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let item_id = setup.instance.items[0].id;
      let stock_id = setup.instance.stocks[0].id;
      let payload = [
        [ 1, [] ],
        [ 2, [ 'dlndkddkdn' ] ],
      ];

      for (let [ id, permissions ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 403, 'C07H08-00');
      }
    });
    it(`should return status 400 when data validation fail`, async () => {
      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let payload = [
        [
          1,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          setup.instance.stocks[0].id,
          {}
        ],
        [
          2,
          setup.instance.items[0].id,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          3,
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllla',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
          {}
        ],
        [
          4,
          setup.instance.items[0].id,
          setup.instance.stocks[0].id,
          { attributes: 'naaaaaa' }
        ],
        [
          5,
          setup.instance.items[0].id,
          setup.instance.stocks[0].id,
          { paranoid: 'naaaaaa' }
        ],
      ];

      for (let [ id, item_id, stock_id, options ] of payload) {
        // Act:
        let res = await supertest(app)
          .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
          .query(options)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

        // Assert:
        setup.assertError(expect, res, 400, 'C07H08-01');
      }
    });
    it(`should return status 500 when item tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let item_id = setup.instance.items[0].id;
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H08-02');
    });
    it(`should return status 404 when item was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H08-03');
    });
    it(`should return status 500 when stock tried to be found`, async () => {
      // Setup:
      mocks.asError({ findByPk: false, getStock: true });

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let item_id = setup.instance.items[0].id;
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 500, 'C07H08-04');
    });
    it(`should return status 404 when stock was not found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.asNotFound({ findByPk: false, getStock: true });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let item_id = setup.instance.items[0].id;
      let stock_id = '5dc8dfea-34c1-4280-bb5a-d18af9296fc1';

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertError(expect, res, 404, 'C07H08-05');
    });
    it(`should return status 200 when stock is found`, async () => {
      // Setup:
      if (setup.is_mocked) {
        mocks.stockIsFound({ setup });
      }

      // Arrange:
      let app = require('src/app.js');
      let permissions = [ 'get stock from item' ];
      let item_id = setup.instance.items[0].id;
      let stock_id = setup.instance.stocks[0].id;

      // Act:
      let res = await supertest(app)
        .get(`${API_BASE}/${item_id}/stocks/${stock_id}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${setup.genToken({ permissions })}`);

      // Assert:
      setup.assertOk(expect, res, 200);
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toBe(stock_id);
    });
  });

  afterEach(setup.afterEach);
  afterAll(setup.afterAll);
});
