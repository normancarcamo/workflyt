import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type supplier = TSchema;
  export type material = TSchema;
  export type getSuppliers = IValidator;
  export type createSupplier = IValidator;
  export type getSupplier = IValidator;
  export type updateSupplier = IValidator;
  export type deleteSupplier = IValidator;
  export type getMaterials = IValidator;
  export type addMaterials = IValidator;
  export type getMaterial = IValidator;
  export type updateMaterial = IValidator;
  export type deleteMaterial = IValidator;
}

export namespace R {
  export type getSuppliers = (options:object) => Promise<any[]>;
  export type createSupplier = (values:object, options?:object) => Promise<any>;
  export type getSupplier = (supplier_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateSupplier = (supplier_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSupplier = (supplier_id:string, options?:object) => Promise<any>;
  export type getMaterials = (supplier_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (supplier_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (supplier_id:string, material_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateMaterial = (supplier_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (supplier_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getSuppliers = (options:object) => Promise<any[]>;
  export type createSupplier = (values:object, options?:object) => Promise<any>;
  export type getSupplier = (supplier_id:string, options:object) => Promise<any>;
  export type updateSupplier = (supplier_id:string, values:object, options:object) => Promise<any>;
  export type deleteSupplier = (supplier_id:string, options:object) => Promise<any>;
  export type getMaterials = (supplier_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (supplier_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (supplier_id:string, material_id:string, options?:object) => Promise<any>;
  export type updateMaterial = (supplier_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (supplier_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getSuppliers = [ IHandler, IHandler, IHandler ];
  export type createSupplier = [ IHandler, IHandler, IHandler ];
  export type getSupplier = [ IHandler, IHandler, IHandler ];
  export type updateSupplier = [ IHandler, IHandler, IHandler ];
  export type deleteSupplier = [ IHandler, IHandler, IHandler ];
  export type getMaterials = [ IHandler, IHandler, IHandler ];
  export type addMaterials = [ IHandler, IHandler, IHandler ];
  export type getMaterial = [ IHandler, IHandler, IHandler ];
  export type updateMaterial = [ IHandler, IHandler, IHandler ];
  export type deleteMaterial = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    supplier: V.supplier;
    material: V.material;
    getSuppliers: V.getSuppliers;
    createSupplier: V.createSupplier;
    getSupplier: V.getSupplier;
    updateSupplier: V.updateSupplier;
    deleteSupplier: V.deleteSupplier;
    getMaterials: V.getMaterials;
    addMaterials: V.addMaterials;
    getMaterial: V.getMaterial;
    updateMaterial: V.updateMaterial;
    deleteMaterial: V.deleteMaterial;
  }

  export type repository = {
    getSuppliers: R.getSuppliers;
    createSupplier: R.createSupplier;
    getSupplier: R.getSupplier;
    updateSupplier: R.updateSupplier;
    deleteSupplier: R.deleteSupplier;
    getMaterials: R.getMaterials;
    addMaterials: R.addMaterials;
    getMaterial: R.getMaterial;
    updateMaterial: R.updateMaterial;
    deleteMaterial: R.deleteMaterial;
  }

  export type service = {
    getSuppliers: S.getSuppliers;
    createSupplier: S.createSupplier;
    getSupplier: S.getSupplier;
    updateSupplier: S.updateSupplier;
    deleteSupplier: S.deleteSupplier;
    getMaterials: S.getMaterials;
    addMaterials: S.addMaterials;
    getMaterial: S.getMaterial;
    updateMaterial: S.updateMaterial;
    deleteMaterial: S.deleteMaterial;
  }

  export type controller = {
    getSuppliers: C.getSuppliers;
    createSupplier: C.createSupplier;
    getSupplier: C.getSupplier;
    updateSupplier: C.updateSupplier;
    deleteSupplier: C.deleteSupplier;
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
