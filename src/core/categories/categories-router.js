const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/categories')
    .get(controller.getCategories)
    .post(controller.createCategory)
    .all(middlewares.methodNotAllowed);

  router.route('/categories/:category')
    .get(controller.getCategory)
    .patch(controller.updateCategory)
    .delete(controller.deleteCategory)
    .all(middlewares.methodNotAllowed);

  router.route('/categories/:category/materials')
    .get(controller.getMaterials)
    .all(middlewares.methodNotAllowed);

  router.route('/categories/:category/materials/:material')
    .get(controller.getMaterial)
    .all(middlewares.methodNotAllowed);

  return router;
};
