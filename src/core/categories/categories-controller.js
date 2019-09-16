module.exports = ({ service, validator, helpers }) => Object.freeze({
  getCategories: [
    helpers.validateRights('get categories'),
    helpers.validateInput(validator.getCategories),
    function handler (req, res, next) {
      service.getCategories(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createCategory: [
    helpers.validateRights('create category'),
    helpers.validateInput(validator.createCategory),
    function handler (req, res, next) {
      service.createCategory(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getCategory: [
    helpers.validateRights('get category'),
    helpers.validateInput(validator.getCategory),
    function handler (req, res, next) {
      let category_id = req.params.category;
      let options = req.query;
      service.getCategory({ category_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateCategory: [
    helpers.validateRights('update category'),
    helpers.validateInput(validator.updateCategory),
    function handler (req, res, next) {
      let category_id = req.params.category;
      let values = req.body;
      let options = req.query;
      service.updateCategory({ category_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteCategory: [
    helpers.validateRights('delete category'),
    helpers.validateInput(validator.deleteCategory),
    function handler (req, res, next) {
      let category_id = req.params.category;
      let options = req.query;
      service.deleteCategory({ category_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterials: [
    helpers.validateRights('get materials from category'),
    helpers.validateInput(validator.getMaterials),
    function handler (req, res, next) {
      let category_id = req.params.category;
      let options = req.query;
      service.getMaterials({ category_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterial: [
    helpers.validateRights('get material from category'),
    helpers.validateInput(validator.getMaterial),
    function handler (req, res, next) {
      let category_id = req.params.category;
      let material_id = req.params.material;
      let options = req.query;
      service.getMaterial({ category_id, material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
