import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type numberType = object;
  export type stock = TSchema;
  export type getStocks = IValidator;
  export type createStock = IValidator;
  export type getStock = IValidator;
  export type updateStock = IValidator;
  export type deleteStock = IValidator;
}

export namespace R {
  export type getStocks = (options:object) => Promise<any[]>;
  export type createStock = (values:object, options?:object) => Promise<any>;
  export type getStock = (stock_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateStock = (stock_id:string, values:object, options?:object) => Promise<any>;
  export type deleteStock = (stock_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getStocks = (options:object) => Promise<any[]>;
  export type createStock = (values:object, options?:object) => Promise<any>;
  export type getStock = (stock_id:string, options:object) => Promise<any>;
  export type updateStock = (stock_id:string, values:object, options:object) => Promise<any>;
  export type deleteStock = (stock_id:string, options:object) => Promise<any>;
}

export namespace C {
  export type getStocks = [ IHandler, IHandler, IHandler ];
  export type createStock = [ IHandler, IHandler, IHandler ];
  export type getStock = [ IHandler, IHandler, IHandler ];
  export type updateStock = [ IHandler, IHandler, IHandler ];
  export type deleteStock = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    stock: V.stock;
    getStocks: V.getStocks;
    createStock: V.createStock;
    getStock: V.getStock;
    updateStock: V.updateStock;
    deleteStock: V.deleteStock;
  }

  export type repository = {
    getStocks: R.getStocks;
    createStock: R.createStock;
    getStock: R.getStock;
    updateStock: R.updateStock;
    deleteStock: R.deleteStock;
  }

  export type service = {
    getStocks: S.getStocks;
    createStock: S.createStock;
    getStock: S.getStock;
    updateStock: S.updateStock;
    deleteStock: S.deleteStock;
  }

  export type controller = {
    getStocks: C.getStocks;
    createStock: C.createStock;
    getStock: C.getStock;
    updateStock: C.updateStock;
    deleteStock: C.deleteStock;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
