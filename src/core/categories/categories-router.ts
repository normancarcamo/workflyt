import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './categories-types';
import { Router } from 'express';

export const CategoryRouter:F.router = (controller) => {
  let router = Router();

  router.route('/categories')
    .get(controller.getCategories)
    .post(controller.createCategory)
    .all(methodNotAllowed);

  router.route('/categories/:category')
    .get(controller.getCategory)
    .patch(controller.updateCategory)
    .delete(controller.deleteCategory)
    .all(methodNotAllowed);

  router.route('/categories/:category/materials')
    .get(controller.getMaterials)
    .all(methodNotAllowed);

  router.route('/categories/:category/materials/:material')
    .get(controller.getMaterial)
    .all(methodNotAllowed);

  return router;
};
