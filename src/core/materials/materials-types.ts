import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type material = TSchema;
  export type stock = TSchema;
  export type getMaterials = IValidator;
  export type createMaterial = IValidator;
  export type getMaterial = IValidator;
  export type updateMaterial = IValidator;
  export type deleteMaterial = IValidator;
  export type getStocks = IValidator;
  export type getStock = IValidator;
}

export namespace R {
  export type getMaterials = (options:object) => Promise<any[]>;
  export type createMaterial = (values:object, options?:object) => Promise<any>;
  export type getMaterial = (material_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateMaterial = (material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (material_id:string, options?:object) => Promise<any>;
  export type getStocks = (material_id:string, options?:object) => Promise<any[]>;
  export type getStock = (material_id:string, stock_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getMaterials = (options:object) => Promise<any[]>;
  export type createMaterial = (values:object, options?:object) => Promise<any>;
  export type getMaterial = (material_id:string, options:object) => Promise<any>;
  export type updateMaterial = (material_id:string, values:object, options:object) => Promise<any>;
  export type deleteMaterial = (material_id:string, options:object) => Promise<any>;
  export type getStocks = (material_id:string, options?:object) => Promise<any[]>;
  export type getStock = (material_id:string, stock_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getMaterials = [ IHandler, IHandler, IHandler ];
  export type createMaterial = [ IHandler, IHandler, IHandler ];
  export type getMaterial = [ IHandler, IHandler, IHandler ];
  export type updateMaterial = [ IHandler, IHandler, IHandler ];
  export type deleteMaterial = [ IHandler, IHandler, IHandler ];
  export type getStocks = [ IHandler, IHandler, IHandler ];
  export type getStock = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    material: V.material;
    stock: V.stock;
    getMaterials: V.getMaterials;
    createMaterial: V.createMaterial;
    getMaterial: V.getMaterial;
    updateMaterial: V.updateMaterial;
    deleteMaterial: V.deleteMaterial;
    getStocks: V.getStocks;
    getStock: V.getStock;
  }

  export type repository = {
    getMaterials: R.getMaterials;
    createMaterial: R.createMaterial;
    getMaterial: R.getMaterial;
    updateMaterial: R.updateMaterial;
    deleteMaterial: R.deleteMaterial;
    getStocks: R.getStocks;
    getStock: R.getStock;
  }

  export type service = {
    getMaterials: S.getMaterials;
    createMaterial: S.createMaterial;
    getMaterial: S.getMaterial;
    updateMaterial: S.updateMaterial;
    deleteMaterial: S.deleteMaterial;
    getStocks: S.getStocks;
    getStock: S.getStock;
  }

  export type controller = {
    getMaterials: C.getMaterials;
    createMaterial: C.createMaterial;
    getMaterial: C.getMaterial;
    updateMaterial: C.updateMaterial;
    deleteMaterial: C.deleteMaterial;
    getStocks: C.getStocks;
    getStock: C.getStock;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
