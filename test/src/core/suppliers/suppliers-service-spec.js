const Repository = require('src/core/suppliers/suppliers-repository');
const Service = require('src/core/suppliers/suppliers-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Supplier Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getSuppliers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getSuppliers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getSuppliers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of suppliers', async () => {
      // Setup:
      jest.spyOn(repository, 'getSuppliers').mockResolvedValue([ DATA.supplier ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getSuppliers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.supplier ]);
    });
  });

  describe('createSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createSupplier').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = service.createSupplier(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier created', async () => {
      // Setup:
      jest.spyOn(repository, 'createSupplier').mockResolvedValue(DATA.supplier);

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = await service.createSupplier(values);

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('getSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getSupplier').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.getSupplier({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getSupplier').mockResolvedValue(DATA.supplier);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.getSupplier({ supplier_id, options });

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('updateSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateSupplier').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSupplier({ supplier_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateSupplier').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSupplier({ supplier_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteSupplier').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.deleteSupplier({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteSupplier').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.deleteSupplier({ supplier_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.getMaterials({ supplier_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockResolvedValue([ DATA.material ]);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.getMaterials({ supplier_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { supplier_id: DATA.supplier.id, materials: [ DATA.material.id ] };

      // Act:
      const res = service.addMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockResolvedValue([ DATA.supplierMaterial ]);

      // Arrange:
      const options = { supplier_id: DATA.supplier.id, materials: [ DATA.material.id ] };

      // Act:
      const res = await service.addMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.supplierMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial({ supplier_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, SupplierMaterial: DATA.supplierMaterial };

      // Mock:
      jest.spyOn(repository, 'getMaterial').mockResolvedValue(expected);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial({ supplier_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial({ supplier_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockResolvedValue({
        ...DATA.supplierMaterial,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial({ supplier_id, material_id, values, options });

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
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockResolvedValue({
        ...DATA.supplierMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial({ supplier_id, material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
