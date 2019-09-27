import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type order = TSchema;
  export type job = TSchema;
  export type getOrders = IValidator;
  export type createOrder = IValidator;
  export type getOrder = IValidator;
  export type updateOrder = IValidator;
  export type deleteOrder = IValidator;
  export type getJobs = IValidator;
  export type getJob = IValidator;
}

export namespace R {
  export type getOrders = (options:object) => Promise<any[]>;
  export type createOrder = (values:object, options?:object) => Promise<any>;
  export type getOrder = (order_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateOrder = (order_id:string, values:object, options?:object) => Promise<any>;
  export type deleteOrder = (order_id:string, options?:object) => Promise<any>;
  export type getJobs = (order_id:string, options?:object) => Promise<any[]>;
  export type getJob = (order_id:string, job_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getOrders = (options:object) => Promise<any[]>;
  export type createOrder = (values:object, options?:object) => Promise<any>;
  export type getOrder = (order_id:string, options:object) => Promise<any>;
  export type updateOrder = (order_id:string, values:object, options:object) => Promise<any>;
  export type deleteOrder = (order_id:string, options:object) => Promise<any>;
  export type getJobs = (order_id:string, options?:object) => Promise<any[]>;
  export type getJob = (order_id:string, job_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getOrders = [ IHandler, IHandler, IHandler ];
  export type createOrder = [ IHandler, IHandler, IHandler ];
  export type getOrder = [ IHandler, IHandler, IHandler ];
  export type updateOrder = [ IHandler, IHandler, IHandler ];
  export type deleteOrder = [ IHandler, IHandler, IHandler ];
  export type getJobs = [ IHandler, IHandler, IHandler ];
  export type getJob = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    order: V.order;
    job: V.job;
    getOrders: V.getOrders;
    createOrder: V.createOrder;
    getOrder: V.getOrder;
    updateOrder: V.updateOrder;
    deleteOrder: V.deleteOrder;
    getJobs: V.getJobs;
    getJob: V.getJob;
  }

  export type repository = {
    getOrders: R.getOrders;
    createOrder: R.createOrder;
    getOrder: R.getOrder;
    updateOrder: R.updateOrder;
    deleteOrder: R.deleteOrder;
    getJobs: R.getJobs;
    getJob: R.getJob;
  }

  export type service = {
    getOrders: S.getOrders;
    createOrder: S.createOrder;
    getOrder: S.getOrder;
    updateOrder: S.updateOrder;
    deleteOrder: S.deleteOrder;
    getJobs: S.getJobs;
    getJob: S.getJob;
  }

  export type controller = {
    getOrders: C.getOrders;
    createOrder: C.createOrder;
    getOrder: C.getOrder;
    updateOrder: C.updateOrder;
    deleteOrder: C.deleteOrder;
    getJobs: C.getJobs;
    getJob: C.getJob;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
