import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type area = TSchema;
  export type worker = TSchema;
  export type service = TSchema;
  export type getAreas = IValidator;
  export type createArea = IValidator;
  export type getArea = IValidator;
  export type updateArea = IValidator;
  export type deleteArea = IValidator;
  export type getSubareas = IValidator;
  export type addSubareas = IValidator;
  export type getSubarea = IValidator;
  export type updateSubarea = IValidator;
  export type deleteSubarea = IValidator;
  export type getWorkers = IValidator;
  export type addWorkers = IValidator;
  export type getWorker = IValidator;
  export type updateWorker = IValidator;
  export type deleteWorker = IValidator;
  export type getServices = IValidator;
  export type getService = IValidator;
}

export namespace R {
  export type getAreas = (options?:object) => Promise<any[]>;
  export type createArea = (values:object, options?:object) => Promise<any>;
  export type getArea = (area_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateArea = (area_id:string, values:object, options?:object) => Promise<any>;
  export type deleteArea = (area_id:string, options?:object) => Promise<any>;
  export type getSubareas = (area_id:string, options?:object) => Promise<any[]>;
  export type addSubareas = (area_id:string, subareas:string[]) => Promise<any[]>;
  export type getSubarea = (area_id:string, subarea_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateSubarea = (area_id:string, subarea_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSubarea = (area_id:string, subarea_id:string, options?:object) => Promise<any>;
  export type getWorkers = (area_id:string, options?:object) => Promise<any[]>;
  export type addWorkers = (area_id:string, workers:string[]) => Promise<any[]>;
  export type getWorker = (area_id:string, worker_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateWorker = (area_id:string, worker_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWorker = (area_id:string, worker_id:string, options?:object) => Promise<any>;
  export type getServices = (area_id:string, options?:object) => Promise<any[]>;
  export type getService = (area_id:string, service_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getAreas = (options:object) => Promise<any[]>;
  export type createArea = (values:object, options?:object) => Promise<any>;
  export type getArea = (area_id:string, options?:object) => Promise<any>;
  export type updateArea = (area_id:string, values:object, options?:object) => Promise<any>;
  export type deleteArea = (area_id:string, options?:object) => Promise<any>;
  export type getSubareas = (area_id:string, options?:object) => Promise<any[]>;
  export type addSubareas = (area_id:string, subareas:string[]) => Promise<any[]>;
  export type getSubarea = (area_id:string, subarea_id:string, options?:object) => Promise<any>;
  export type updateSubarea = (area_id:string, subarea_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSubarea = (area_id:string, subarea_id:string, options?:object) => Promise<any>;
  export type getWorkers = (area_id:string, options?:object) => Promise<any[]>;
  export type addWorkers = (area_id:string, workers:string[]) => Promise<any[]>;
  export type getWorker = (area_id:string, worker_id:string, options?:object) => Promise<any>;
  export type updateWorker = (area_id:string, worker_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWorker = (area_id:string, worker_id:string, options?:object) => Promise<any>;
  export type getServices = (area_id:string, options?:object) => Promise<any[]>;
  export type getService = (area_id:string, service_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getAreas = [ IHandler, IHandler, IHandler ];
  export type createArea = [ IHandler, IHandler, IHandler ];
  export type getArea = [ IHandler, IHandler, IHandler ];
  export type updateArea = [ IHandler, IHandler, IHandler ];
  export type deleteArea = [ IHandler, IHandler, IHandler ];
  export type getSubareas = [ IHandler, IHandler, IHandler ];
  export type addSubareas = [ IHandler, IHandler, IHandler ];
  export type getSubarea = [ IHandler, IHandler, IHandler ];
  export type updateSubarea = [ IHandler, IHandler, IHandler ];
  export type deleteSubarea = [ IHandler, IHandler, IHandler ];
  export type getWorkers = [ IHandler, IHandler, IHandler ];
  export type addWorkers = [ IHandler, IHandler, IHandler ];
  export type getWorker = [ IHandler, IHandler, IHandler ];
  export type updateWorker = [ IHandler, IHandler, IHandler ];
  export type deleteWorker = [ IHandler, IHandler, IHandler ];
  export type getServices = [ IHandler, IHandler, IHandler ];
  export type getService = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    area: V.area;
    worker: V.worker;
    service: V.service;
    getAreas: V.getAreas;
    createArea: V.createArea;
    getArea: V.getArea;
    updateArea: V.updateArea;
    deleteArea: V.deleteArea;
    getSubareas: V.getSubareas;
    addSubareas: V.addSubareas;
    getSubarea: V.getSubarea;
    updateSubarea: V.updateSubarea;
    deleteSubarea: V.deleteSubarea;
    getWorkers: V.getWorkers;
    addWorkers: V.addWorkers;
    getWorker: V.getWorker;
    updateWorker: V.updateWorker;
    deleteWorker: V.deleteWorker;
    getServices: V.getServices;
    getService: V.getService;
  }

  export type repository = {
    getAreas: R.getAreas;
    createArea: R.createArea;
    getArea: R.getArea;
    updateArea: R.updateArea;
    deleteArea: R.deleteArea;
    getSubareas: R.getSubareas;
    addSubareas: R.addSubareas;
    getSubarea: R.getSubarea;
    updateSubarea: R.updateSubarea;
    deleteSubarea: R.deleteSubarea;
    getWorkers: R.getWorkers;
    addWorkers: R.addWorkers;
    getWorker: R.getWorker;
    updateWorker: R.updateWorker;
    deleteWorker: R.deleteWorker;
    getServices: R.getServices;
    getService: R.getService;
  }

  export type service = {
    getAreas: S.getAreas;
    createArea: S.createArea;
    getArea: S.getArea;
    updateArea: S.updateArea;
    deleteArea: S.deleteArea;
    getSubareas: S.getSubareas;
    addSubareas: S.addSubareas;
    getSubarea: S.getSubarea;
    updateSubarea: S.updateSubarea;
    deleteSubarea: S.deleteSubarea;
    getWorkers: S.getWorkers;
    addWorkers: S.addWorkers;
    getWorker: S.getWorker;
    updateWorker: S.updateWorker;
    deleteWorker: S.deleteWorker;
    getServices: S.getServices;
    getService: S.getService;
  }

  export type controller = {
    getAreas: C.getAreas;
    createArea: C.createArea;
    getArea: C.getArea;
    updateArea: C.updateArea;
    deleteArea: C.deleteArea;
    getSubareas: C.getSubareas;
    addSubareas: C.addSubareas;
    getSubarea: C.getSubarea;
    updateSubarea: C.updateSubarea;
    deleteSubarea: C.deleteSubarea;
    getWorkers: C.getWorkers;
    addWorkers: C.addWorkers;
    getWorker: C.getWorker;
    updateWorker: C.updateWorker;
    deleteWorker: C.deleteWorker;
    getServices: C.getServices;
    getService: C.getService;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
