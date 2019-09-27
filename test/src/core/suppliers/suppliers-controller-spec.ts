import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Suppliers - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Suppliers', () => {
    it('GET /suppliers --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getSuppliers: async (options?:object) => [ DATA.supplier ]
          })
        }));
      } else {
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let permissions = [ 'get suppliers' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/suppliers`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Supplier', () => {
    it(`POST /suppliers --> There is an supplier with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            createSupplier: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let permissions = [ 'create supplier' ];
      let data = DATA.supplier;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/suppliers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /suppliers --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            createSupplier: async (values:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create supplier' ];
      let data = { ...DATA.supplier };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/suppliers`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Supplier', () => {
    it(`GET /suppliers/:supplier --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getSupplier: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'get supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /suppliers/:supplier --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getSupplier: async (supplier_id:string, options?:object) => DATA.supplier
          })
        }));
      } else {
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'get supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.supplier.id);
    });
  });

  describe('Updating Supplier', () => {
    it(`PATCH /suppliers/:supplier --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            updateSupplier: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'update supplier' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /suppliers/:supplier --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            updateSupplier: async (supplier_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'update supplier' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Supplier', () => {
    it(`DELETE /suppliers/:supplier --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            deleteSupplier: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'delete supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /suppliers/:supplier --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            deleteSupplier: async (supplier_id:string, options?:object) => ({
              id: supplier_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}`;
      let permissions = [ 'delete supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.supplier.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Materials', () => {
    it(`GET /suppliers/:supplier/materials --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials`;
      let permissions = [ 'get materials from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /suppliers/:supplier/materials --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getMaterials: async (supplier_id:string, options?:object) => [{
              ...DATA.material,
              SupplierMaterial: DATA.supplier
            }]
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let supplier = await db.models.Supplier.create(DATA.supplier);
        let material = await db.models.Material.create(DATA.material);
        await supplier.addMaterial(material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}/materials`;
      let permissions = [ 'get materials from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding materials', () => {
    it(`PUT /suppliers/:supplier/materials --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            addMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials`;
      let permissions = [ 'add materials to supplier' ];
      let data = { materials: [ material_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /suppliers/:supplier/materials --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            addMaterials: async (supplier_id:string, materials:string[]) => [ DATA.supplierMaterial ]
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let endpoint = `${API_BASE}/suppliers/${DATA.supplier.id}/materials`;
      let permissions = [ 'add materials to supplier' ];
      let data = { materials: [ DATA.material.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].supplier_id).toEqual(DATA.supplier.id);
      expect(res.body.data[0].material_id).toEqual(DATA.material.id);
    });
  });

  describe('Retrieve material', () => {
    it(`GET /suppliers/:supplier/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'get material from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /suppliers/:supplier/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            getMaterial: async (supplier_id:string, material_id:string, options?:object) => ({
              ...DATA.material,
              SupplierMaterial: DATA.supplierMaterial
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let supplier = await db.models.Supplier.create(DATA.supplier);
        await supplier.addMaterial(material);
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'get material from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(material_id);
    });
  });

  describe('Updating material', () => {
    it(`PATCH /suppliers/:supplier/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            updateMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'update material from supplier' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /suppliers/:supplier/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            updateMaterial: async (supplier_id:string, material_id:string, values:object, options?:object) => ({
              supplier_id: supplier_id,
              material_id: material_id,
              ...values
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let supplier = await db.models.Supplier.create(DATA.supplier);
        await supplier.addMaterial(material);
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'update material from supplier' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting material', () => {
    it(`DELETE /suppliers/:supplier/materials/:material --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            deleteMaterial: helpers.serviceNotFoundError
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let supplier = await db.models.Supplier.create(DATA.supplier);
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'delete material from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /suppliers/:supplier/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/suppliers/suppliers-service', () => ({
          SupplierService: () => ({
            deleteMaterial: async (supplier_id:string, material_id:string, options?:object) => ({
              supplier_id: supplier_id,
              material_id: material_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let supplier = await db.models.Supplier.create(DATA.supplier);
        await supplier.addMaterial(material);
      }

      // Arrange:
      let supplier_id = DATA.supplier.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/suppliers/${supplier_id}/materials/${material_id}`;
      let permissions = [ 'delete material from supplier' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.supplier_id).toEqual(supplier_id);
      expect(res.body.data.material_id).toEqual(material_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
