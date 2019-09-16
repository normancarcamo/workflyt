const Repository = require('src/core/suppliers/suppliers-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Supplier Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getSuppliers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getSuppliers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of suppliers', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findAll')
        .mockResolvedValue([ DATA.supplier ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getSuppliers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.supplier ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getSuppliers(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = repository.createSupplier(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier created', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'create')
        .mockResolvedValue(DATA.supplier);

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = await repository.createSupplier(values);

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('getSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getSupplier({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when supplier was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getSupplier({ supplier_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getSupplier({ supplier_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return supplier when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk')
        .mockResolvedValue(DATA.supplier);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getSupplier({ supplier_id, options });

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('updateSupplier', () => {
    it('should throw error when supplier was not found', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupplier({ supplier_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupplier({ supplier_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSupplier({ supplier_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteSupplier', () => {
    it('should throw error when supplier was not found', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.deleteSupplier({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.deleteSupplier({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.deleteSupplier({ supplier_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when supplier was not found', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([ DATA.material ])
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ supplier_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ supplier_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addMaterials', () => {
    it('should throw error when supplier was not found', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = repository.addMaterials({ supplier_id, materials });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        addMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        supplier_id: DATA.supplier.id,
        materials: [ DATA.material.id ]
      };

      // Act:
      const res = repository.addMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        addMaterials: jest.fn().mockResolvedValue([
          DATA.supplierMaterial
        ])
      });

      // Arrange:
      const options = {
        supplier_id: DATA.supplier.id,
        materials: [ DATA.material.id ]
      };

      // Act:
      const res = await repository.addMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.supplierMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when supplier was not found', () => {
      // Setup:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ supplier_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ supplier_id, material_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ supplier_id, material_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ supplier_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, SupplierMaterial: DATA.supplierMaterial };

      // Mock:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ supplier_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when supplier was not found', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ supplier_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ supplier_id, material_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          SupplierMaterial: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ supplier_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          SupplierMaterial: {
            update: jest.fn().mockResolvedValue({
              ...DATA.supplierMaterial,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial({ supplier_id, material_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when supplier was not found', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          SupplierMaterial: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Supplier, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          SupplierMaterial: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.supplierMaterial,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
