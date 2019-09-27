import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { SupplierRepository } from '../../../../src/core/suppliers/suppliers-repository';

describe('Supplier Repository', () => {
  const database = { ...DATABASE() };
  const repository = SupplierRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getSuppliers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Supplier.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getSuppliers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of suppliers', async () => {
      // Setup:
      database.models.Supplier.findAll = (async () => [ DATA.supplier ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getSuppliers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.supplier ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Supplier.findAll = (async () => []) as any;

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
      database.models.Supplier.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = repository.createSupplier(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier created', async () => {
      // Setup:
      database.models.Supplier.create = (async () => DATA.supplier) as any;

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
      database.models.Supplier.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getSupplier(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when supplier was not found', async () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => null) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getSupplier(supplier_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => null) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getSupplier(supplier_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return supplier when is found', async () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => DATA.supplier) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getSupplier(supplier_id, options);

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('updateSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupplier(supplier_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSupplier(supplier_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.deleteSupplier(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier deleted when is found', async () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.deleteSupplier(supplier_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = repository.getMaterials(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => [ DATA.material ]
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(supplier_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => []
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(supplier_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        addMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = repository.addMaterials(supplier_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Supplier.findByPk = (async () => ({
        addMaterials: async () => [ DATA.supplierMaterial ]
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = await repository.addMaterials(supplier_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.supplierMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should return null when material was not found', async () => {
      // Mock:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(supplier_id, material_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(supplier_id, material_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(supplier_id, material_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.material, SupplierMaterial: DATA.supplierMaterial };
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => expected
      })) as any;
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(supplier_id, material_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => ({
          SupplierMaterial: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial(supplier_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => ({
          SupplierMaterial: {
            update: async () => ({
              ...DATA.supplierMaterial,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial(supplier_id, material_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => ({
          SupplierMaterial: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial(supplier_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Supplier.findByPk = (async () => ({
        getMaterials: async () => ({
          SupplierMaterial: {
            destroy: async () => ({
              ...DATA.supplierMaterial,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial(supplier_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
