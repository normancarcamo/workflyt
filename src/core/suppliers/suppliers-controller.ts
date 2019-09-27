import { F } from './suppliers-types';

export const SupplierController:F.controller = (service, validator, helpers) => ({
  getSuppliers: [
    helpers.validateRights('get suppliers'),
    helpers.validateInput(validator.getSuppliers),
    function handler (req, res, next) {
      service.getSuppliers(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createSupplier: [
    helpers.validateRights('create supplier'),
    helpers.validateInput(validator.createSupplier),
    function handler (req, res, next) {
      service.createSupplier(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSupplier: [
    helpers.validateRights('get supplier'),
    helpers.validateInput(validator.getSupplier),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let options = req.query;
      service.getSupplier(supplier_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateSupplier: [
    helpers.validateRights('update supplier'),
    helpers.validateInput(validator.updateSupplier),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let values = req.body;
      let options = req.query;
      service.updateSupplier(supplier_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteSupplier: [
    helpers.validateRights('delete supplier'),
    helpers.validateInput(validator.deleteSupplier),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let options = req.query;
      service.deleteSupplier(supplier_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterials: [
    helpers.validateRights('get materials from supplier'),
    helpers.validateInput(validator.getMaterials),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let options = req.query;
      service.getMaterials(supplier_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addMaterials: [
    helpers.validateRights('add materials to supplier'),
    helpers.validateInput(validator.addMaterials),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let materials = req.body.materials;
      service.addMaterials(supplier_id, materials)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterial: [
    helpers.validateRights('get material from supplier'),
    helpers.validateInput(validator.getMaterial),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let material_id = req.params.material;
      let options = req.query;
      service.getMaterial(supplier_id, material_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateMaterial: [
    helpers.validateRights('update material from supplier'),
    helpers.validateInput(validator.updateMaterial),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let material_id = req.params.material;
      let values = req.body;
      let options = req.query;
      service.updateMaterial(supplier_id, material_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteMaterial: [
    helpers.validateRights('delete material from supplier'),
    helpers.validateInput(validator.deleteMaterial),
    function handler (req, res, next) {
      let supplier_id = req.params.supplier;
      let material_id = req.params.material;
      let options = req.query;
      service.deleteMaterial(supplier_id, material_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
