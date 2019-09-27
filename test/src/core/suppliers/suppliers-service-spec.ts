import '../../../config/global';
import { SupplierRepository } from '../../../../src/core/suppliers/suppliers-repository';
import { SupplierService } from '../../../../src/core/suppliers/suppliers-service';
import { I } from '../../../../src/core/suppliers/suppliers-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Supplier Service', () => {
  let database = {};
  let repository = SupplierRepository(database);
  let service:I.service = SupplierService(repository);

  beforeEach(async () => { service = SupplierService(repository); });

  describe('getSuppliers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getSuppliers = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getSuppliers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of suppliers', async () => {
      // Setup:
      repository.getSuppliers = async () => [ DATA.supplier ];

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
      repository.createSupplier = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.supplier;

      // Act:
      const res = service.createSupplier(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier created', async () => {
      // Setup:
      repository.createSupplier = async () => DATA.supplier;

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
      repository.getSupplier = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.getSupplier(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier when is found', async () => {
      // Setup:
      repository.getSupplier = async () => DATA.supplier;

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.getSupplier(supplier_id, options);

      // Assert:
      expect(res).toEqual(DATA.supplier);
    });
  });

  describe('updateSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateSupplier = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSupplier(supplier_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      repository.updateSupplier = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSupplier(supplier_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSupplier', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteSupplier = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.deleteSupplier(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return supplier updated when is found', async () => {
      // Setup:
      repository.deleteSupplier = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.deleteSupplier(supplier_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = service.getMaterials(supplier_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getMaterials = async () => [ DATA.material ];

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const options = {};

      // Act:
      const res = await service.getMaterials(supplier_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = service.addMaterials(supplier_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addMaterials = async () => [ DATA.supplierMaterial ];

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = await service.addMaterials(supplier_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.supplierMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial(supplier_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.material, SupplierMaterial: DATA.supplierMaterial };
      repository.getMaterial = async () => expected;
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial(supplier_id, material_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial(supplier_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      repository.updateMaterial = async () => ({
        ...DATA.supplierMaterial,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial(supplier_id, material_id, values, options);

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
      repository.deleteMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const supplier_id = DATA.supplier.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial(supplier_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deleteMaterial = async () => ({
        ...DATA.supplierMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const supplier_id = DATA.supplierMaterial.supplier_id;
      const material_id = DATA.supplierMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial(supplier_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.supplier_id).toEqual(supplier_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
