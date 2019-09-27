import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type service = TSchema;
  export type job = TSchema;
  export type getServices = IValidator;
  export type createService = IValidator;
  export type getService = IValidator;
  export type updateService = IValidator;
  export type deleteService = IValidator;
  export type getJobs = IValidator;
  export type getJob = IValidator;
}

export namespace R {
  export type getServices = (options:object) => Promise<any[]>;
  export type createService = (values:object, options?:object) => Promise<any>;
  export type getService = (service_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateService = (service_id:string, values:object, options?:object) => Promise<any>;
  export type deleteService = (service_id:string, options?:object) => Promise<any>;
  export type getJobs = (service_id:string, options?:object) => Promise<any[]>;
  export type getJob = (service_id:string, job_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getServices = (options:object) => Promise<any[]>;
  export type createService = (values:object, options?:object) => Promise<any>;
  export type getService = (service_id:string, options:object) => Promise<any>;
  export type updateService = (service_id:string, values:object, options:object) => Promise<any>;
  export type deleteService = (service_id:string, options:object) => Promise<any>;
  export type getJobs = (service_id:string, options?:object) => Promise<any[]>;
  export type getJob = (service_id:string, job_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getServices = [ IHandler, IHandler, IHandler ];
  export type createService = [ IHandler, IHandler, IHandler ];
  export type getService = [ IHandler, IHandler, IHandler ];
  export type updateService = [ IHandler, IHandler, IHandler ];
  export type deleteService = [ IHandler, IHandler, IHandler ];
  export type getJobs = [ IHandler, IHandler, IHandler ];
  export type getJob = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    service: V.service;
    job: V.job;
    getServices: V.getServices;
    createService: V.createService;
    getService: V.getService;
    updateService: V.updateService;
    deleteService: V.deleteService;
    getJobs: V.getJobs;
    getJob: V.getJob;
  }

  export type repository = {
    getServices: R.getServices;
    createService: R.createService;
    getService: R.getService;
    updateService: R.updateService;
    deleteService: R.deleteService;
    getJobs: R.getJobs;
    getJob: R.getJob;
  }

  export type service = {
    getServices: S.getServices;
    createService: S.createService;
    getService: S.getService;
    updateService: S.updateService;
    deleteService: S.deleteService;
    getJobs: S.getJobs;
    getJob: S.getJob;
  }

  export type controller = {
    getServices: C.getServices;
    createService: C.createService;
    getService: C.getService;
    updateService: C.updateService;
    deleteService: C.deleteService;
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
