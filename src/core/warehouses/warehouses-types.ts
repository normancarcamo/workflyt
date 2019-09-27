import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type warehouse = TSchema;
  export type material = TSchema;
  export type getWarehouses = IValidator;
  export type createWarehouse = IValidator;
  export type getWarehouse = IValidator;
  export type updateWarehouse = IValidator;
  export type deleteWarehouse = IValidator;
  export type getMaterials = IValidator;
  export type addMaterials = IValidator;
  export type getMaterial = IValidator;
  export type updateMaterial = IValidator;
  export type deleteMaterial = IValidator;
}

export namespace R {
  export type getWarehouses = (options:object) => Promise<any[]>;
  export type createWarehouse = (values:object, options?:object) => Promise<any>;
  export type getWarehouse = (warehouse_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateWarehouse = (warehouse_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWarehouse = (warehouse_id:string, options?:object) => Promise<any>;
  export type getMaterials = (warehouse_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (warehouse_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (warehouse_id:string, material_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateMaterial = (warehouse_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (warehouse_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getWarehouses = (options:object) => Promise<any[]>;
  export type createWarehouse = (values:object, options?:object) => Promise<any>;
  export type getWarehouse = (warehouse_id:string, options:object) => Promise<any>;
  export type updateWarehouse = (warehouse_id:string, values:object, options:object) => Promise<any>;
  export type deleteWarehouse = (warehouse_id:string, options:object) => Promise<any>;
  export type getMaterials = (warehouse_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (warehouse_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (warehouse_id:string, material_id:string, options?:object) => Promise<any>;
  export type updateMaterial = (warehouse_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (warehouse_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getWarehouses = [ IHandler, IHandler, IHandler ];
  export type createWarehouse = [ IHandler, IHandler, IHandler ];
  export type getWarehouse = [ IHandler, IHandler, IHandler ];
  export type updateWarehouse = [ IHandler, IHandler, IHandler ];
  export type deleteWarehouse = [ IHandler, IHandler, IHandler ];
  export type getMaterials = [ IHandler, IHandler, IHandler ];
  export type addMaterials = [ IHandler, IHandler, IHandler ];
  export type getMaterial = [ IHandler, IHandler, IHandler ];
  export type updateMaterial = [ IHandler, IHandler, IHandler ];
  export type deleteMaterial = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    warehouse: V.warehouse;
    material: V.material;
    getWarehouses: V.getWarehouses;
    createWarehouse: V.createWarehouse;
    getWarehouse: V.getWarehouse;
    updateWarehouse: V.updateWarehouse;
    deleteWarehouse: V.deleteWarehouse;
    getMaterials: V.getMaterials;
    addMaterials: V.addMaterials;
    getMaterial: V.getMaterial;
    updateMaterial: V.updateMaterial;
    deleteMaterial: V.deleteMaterial;
  }

  export type repository = {
    getWarehouses: R.getWarehouses;
    createWarehouse: R.createWarehouse;
    getWarehouse: R.getWarehouse;
    updateWarehouse: R.updateWarehouse;
    deleteWarehouse: R.deleteWarehouse;
    getMaterials: R.getMaterials;
    addMaterials: R.addMaterials;
    getMaterial: R.getMaterial;
    updateMaterial: R.updateMaterial;
    deleteMaterial: R.deleteMaterial;
  }

  export type service = {
    getWarehouses: S.getWarehouses;
    createWarehouse: S.createWarehouse;
    getWarehouse: S.getWarehouse;
    updateWarehouse: S.updateWarehouse;
    deleteWarehouse: S.deleteWarehouse;
    getMaterials: S.getMaterials;
    addMaterials: S.addMaterials;
    getMaterial: S.getMaterial;
    updateMaterial: S.updateMaterial;
    deleteMaterial: S.deleteMaterial;
  }

  export type controller = {
    getWarehouses: C.getWarehouses;
    createWarehouse: C.createWarehouse;
    getWarehouse: C.getWarehouse;
    updateWarehouse: C.updateWarehouse;
    deleteWarehouse: C.deleteWarehouse;
    getMaterials: C.getMaterials;
    addMaterials: C.addMaterials;
    getMaterial: C.getMaterial;
    updateMaterial: C.updateMaterial;
    deleteMaterial: C.deleteMaterial;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
