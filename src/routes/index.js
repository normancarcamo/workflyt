import { methodNotAllowed } from '@playscode/fns/lib/middlewares';
import { Router } from "express";
// import * as AuthService from "./services/auth";
import * as CompanyService from "./services/company";
import * as WarehouseService from "./services/warehouse";
import * as CategoryService from "./services/category";
import * as SupplierService from "./services/supplier";
import * as ItemService from "./services/item";

const router = Router();

// AUTH:
// router
//   .route("/auth/signup")
//   .post(AuthService.signUp)
//   .all(methodNotAllowed);
// router
//   .route("/auth/signin")
//   .post(AuthService.signIn)
//   .all(methodNotAllowed);

// COMPANIES:
router
  .route('/companies')
  .get(CompanyService.get_companies)
  .post(CompanyService.create_companies)
  .all(methodNotAllowed);
router
  .route('/companies/:company')
  .get(CompanyService.get_company)
  .put(CompanyService.update_company)
  .delete(CompanyService.delete_company)
  .all(methodNotAllowed);

// CATEGORIES:
router
  .route('/categories')
  .get(CategoryService.get_categories)
  .post(CategoryService.create_categories)
  .all(methodNotAllowed);
router
  .route('/categories/:category')
  .get(CategoryService.get_category)
  .put(CategoryService.update_category)
  .delete(CategoryService.delete_category)
  .all(methodNotAllowed);
router
  .route('/categories/:category/items')
  .post(CategoryService.add_items)
  .get(CategoryService.get_items)
  .all(methodNotAllowed);
router
  .route('/categories/:category/items/:item')
  .get(CategoryService.get_item)
  .all(methodNotAllowed);

// ITEMS:
router
  .route('/items')
  .get(ItemService.get_items)
  .post(ItemService.create_items)
  .all(methodNotAllowed);
router
  .route('/items/:item')
  .get(ItemService.get_item)
  .put(ItemService.update_item)
  .delete(ItemService.delete_item)
  .all(methodNotAllowed);
router
  .route('/items/:item/types')
  .get(ItemService.get_types)
  .post(ItemService.add_types)
  .all(methodNotAllowed);
router
  .route('/items/:item/types/:type')
  .get(ItemService.get_type)
  .put(ItemService.update_type)
  .delete(ItemService.remove_type)
  .all(methodNotAllowed);

// WAREHOUSES:
router
  .route('/warehouses')
  .get(WarehouseService.get_warehouses)
  .post(WarehouseService.create_warehouses)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse')
  .get(WarehouseService.get_warehouse)
  .put(WarehouseService.update_warehouse)
  .delete(WarehouseService.delete_warehouse)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse/items')
  .get(WarehouseService.get_items)
  .post(WarehouseService.add_items)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse/items/:item')
  .get(WarehouseService.get_item)
  .put(WarehouseService.update_item)
  .delete(WarehouseService.remove_item)
  .all(methodNotAllowed);

// SUPPLIERS:
router
  .route('/suppliers')
  .get(SupplierService.get_suppliers)
  .post(SupplierService.create_suppliers)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier')
  .get(SupplierService.get_supplier)
  .put(SupplierService.update_supplier)
  .delete(SupplierService.delete_supplier)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier/items')
  .get(SupplierService.get_items)
  .post(SupplierService.add_items)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier/items/:item')
  .get(SupplierService.get_item)
  .put(SupplierService.update_item)
  .delete(SupplierService.remove_item)
  .all(methodNotAllowed);

export default router;
