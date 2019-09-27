import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type category = TSchema;
  export type material = TSchema;
  export type getCategories = IValidator;
  export type createCategory = IValidator;
  export type getCategory = IValidator;
  export type updateCategory = IValidator;
  export type deleteCategory = IValidator;
  export type getMaterials = IValidator;
  export type getMaterial = IValidator;
}

export namespace R {
  export type getCategories = (options:object) => Promise<any[]>;
  export type createCategory = (values:object, options?:object) => Promise<any>;
  export type getCategory = (category_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateCategory = (category_id:string, values:object, options?:object) => Promise<any>;
  export type deleteCategory = (category_id:string, options?:object) => Promise<any>;
  export type getMaterials = (category_id:string, options?:object) => Promise<any[]>;
  export type getMaterial = (category_id:string, material_id:string, options?:object, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getCategories = (options:object) => Promise<any[]>;
  export type createCategory = (values:object, options?:object) => Promise<any>;
  export type getCategory = (category_id:string, options:object) => Promise<any>;
  export type updateCategory = (category_id:string, values:object, options:object) => Promise<any>;
  export type deleteCategory = (category_id:string, options:object) => Promise<any>;
  export type getMaterials = (category_id:string, options:object) => Promise<any[]>;
  export type getMaterial = (category_id:string, material_id:string, options:object) => Promise<any>;
}

export namespace C {
  export type getCategories = [ IHandler, IHandler, IHandler ];
  export type createCategory = [ IHandler, IHandler, IHandler ];
  export type getCategory = [ IHandler, IHandler, IHandler ];
  export type updateCategory = [ IHandler, IHandler, IHandler ];
  export type deleteCategory = [ IHandler, IHandler, IHandler ];
  export type getMaterials = [ IHandler, IHandler, IHandler ];
  export type getMaterial = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    category: V.category;
    material: V.material;
    getCategories: V.getCategories;
    createCategory: V.createCategory;
    getCategory: V.getCategory;
    updateCategory: V.updateCategory;
    deleteCategory: V.deleteCategory;
    getMaterials: V.getMaterials;
    getMaterial: V.getMaterial;
  }

  export type repository = {
    getCategories: R.getCategories;
    createCategory: R.createCategory;
    getCategory: R.getCategory;
    updateCategory: R.updateCategory;
    deleteCategory: R.deleteCategory;
    getMaterials: R.getMaterials;
    getMaterial: R.getMaterial;
  }

  export type service = {
    getCategories: S.getCategories;
    createCategory: S.createCategory;
    getCategory: S.getCategory;
    updateCategory: S.updateCategory;
    deleteCategory: S.deleteCategory;
    getMaterials: S.getMaterials;
    getMaterial: S.getMaterial;
  }

  export type controller = {
    getCategories: C.getCategories;
    createCategory: C.createCategory;
    getCategory: C.getCategory;
    updateCategory: C.updateCategory;
    deleteCategory: C.deleteCategory;
    getMaterials: C.getMaterials;
    getMaterial: C.getMaterial;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
