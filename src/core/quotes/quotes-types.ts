import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type quote = TSchema;
  export type service = TSchema;
  export type order = TSchema;
  export type getQuotes = IValidator;
  export type createQuote = IValidator;
  export type getQuote = IValidator;
  export type updateQuote = IValidator;
  export type deleteQuote = IValidator;
  export type getServices = IValidator;
  export type addServices = IValidator;
  export type getService = IValidator;
  export type updateService = IValidator;
  export type deleteService = IValidator;
  export type getOrders = IValidator;
  export type getOrder = IValidator;
}

export namespace R {
  export type getQuotes = (options:object) => Promise<any[]>;
  export type createQuote = (values:object, options?:object) => Promise<any>;
  export type getQuote = (quote_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateQuote = (quote_id:string, values:object, options?:object) => Promise<any>;
  export type deleteQuote = (quote_id:string, options?:object) => Promise<any>;
  export type getServices = (quote_id:string, options?:object) => Promise<any[]>;
  export type addServices = (quote_id:string, services:string[]) => Promise<any[]>;
  export type getService = (quote_id:string, service_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateService = (quote_id:string, service_id:string, values:object, options?:object) => Promise<any>;
  export type deleteService = (quote_id:string, service_id:string, options?:object) => Promise<any>;
  export type getOrders = (quote_id:string, options?:object) => Promise<any[]>;
  export type getOrder = (quote_id:string, order_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getQuotes = (options:object) => Promise<any[]>;
  export type createQuote = (values:object, options?:object) => Promise<any>;
  export type getQuote = (quote_id:string, options:object) => Promise<any>;
  export type updateQuote = (quote_id:string, values:object, options:object) => Promise<any>;
  export type deleteQuote = (quote_id:string, options:object) => Promise<any>;
  export type getServices = (quote_id:string, options?:object) => Promise<any[]>;
  export type addServices = (quote_id:string, services:string[]) => Promise<any[]>;
  export type getService = (quote_id:string, service_id:string, options?:object) => Promise<any>;
  export type updateService = (quote_id:string, service_id:string, values:object, options?:object) => Promise<any>;
  export type deleteService = (quote_id:string, service_id:string, options?:object) => Promise<any>;
  export type getOrders = (quote_id:string, options?:object) => Promise<any[]>;
  export type getOrder = (quote_id:string, order_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getQuotes = [ IHandler, IHandler, IHandler ];
  export type createQuote = [ IHandler, IHandler, IHandler ];
  export type getQuote = [ IHandler, IHandler, IHandler ];
  export type updateQuote = [ IHandler, IHandler, IHandler ];
  export type deleteQuote = [ IHandler, IHandler, IHandler ];
  export type getServices = [ IHandler, IHandler, IHandler ];
  export type addServices = [ IHandler, IHandler, IHandler ];
  export type getService = [ IHandler, IHandler, IHandler ];
  export type updateService = [ IHandler, IHandler, IHandler ];
  export type deleteService = [ IHandler, IHandler, IHandler ];
  export type getOrders = [ IHandler, IHandler, IHandler ];
  export type getOrder = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    quote: V.quote;
    service: V.service;
    getQuotes: V.getQuotes;
    createQuote: V.createQuote;
    getQuote: V.getQuote;
    updateQuote: V.updateQuote;
    deleteQuote: V.deleteQuote;
    getServices: V.getServices;
    addServices: V.addServices;
    getService: V.getService;
    updateService: V.updateService;
    deleteService: V.deleteService;
    getOrders: V.getOrders;
    getOrder: V.getOrder;
  }

  export type repository = {
    getQuotes: R.getQuotes;
    createQuote: R.createQuote;
    getQuote: R.getQuote;
    updateQuote: R.updateQuote;
    deleteQuote: R.deleteQuote;
    getServices: R.getServices;
    addServices: R.addServices;
    getService: R.getService;
    updateService: R.updateService;
    deleteService: R.deleteService;
    getOrders: R.getOrders;
    getOrder: R.getOrder;
  }

  export type service = {
    getQuotes: S.getQuotes;
    createQuote: S.createQuote;
    getQuote: S.getQuote;
    updateQuote: S.updateQuote;
    deleteQuote: S.deleteQuote;
    getServices: S.getServices;
    addServices: S.addServices;
    getService: S.getService;
    updateService: S.updateService;
    deleteService: S.deleteService;
    getOrders: S.getOrders;
    getOrder: S.getOrder;
  }

  export type controller = {
    getQuotes: C.getQuotes;
    createQuote: C.createQuote;
    getQuote: C.getQuote;
    updateQuote: C.updateQuote;
    deleteQuote: C.deleteQuote;
    getServices: C.getServices;
    addServices: C.addServices;
    getService: C.getService;
    updateService: C.updateService;
    deleteService: C.deleteService;
    getOrders: C.getOrders;
    getOrder: C.getOrder;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
