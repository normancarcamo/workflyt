import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type job = TSchema;
  export type worker = TSchema;
  export type material = TSchema;
  export type getJobs = IValidator;
  export type createJob = IValidator;
  export type getJob = IValidator;
  export type updateJob = IValidator;
  export type deleteJob = IValidator;
  export type getSubjobs = IValidator;
  export type addSubjobs = IValidator;
  export type getSubjob = IValidator;
  export type updateSubjob = IValidator;
  export type deleteSubjob = IValidator;
  export type getWorkers = IValidator;
  export type addWorkers = IValidator;
  export type getWorker = IValidator;
  export type updateWorker = IValidator;
  export type deleteWorker = IValidator;
  export type getMaterials = IValidator;
  export type addMaterials = IValidator;
  export type getMaterial = IValidator;
  export type updateMaterial = IValidator;
  export type deleteMaterial = IValidator;
}

export namespace R {
  export type getJobs = (options:object) => Promise<any[]>;
  export type createJob = (values:object, options?:object) => Promise<any>;
  export type getJob = (job_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateJob = (job_id:string, values:object, options?:object) => Promise<any>;
  export type deleteJob = (job_id:string, options?:object) => Promise<any>;
  export type getSubjobs = (job_id:string, options?:object) => Promise<any[]>;
  export type addSubjobs = (job_id:string, subjobs:string[]) => Promise<any[]>;
  export type getSubjob = (job_id:string, subjob_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateSubjob = (job_id:string, subjob_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSubjob = (job_id:string, subjob_id:string, options?:object) => Promise<any>;
  export type getWorkers = (job_id:string, options?:object) => Promise<any[]>;
  export type addWorkers = (job_id:string, workers:string[]) => Promise<any[]>;
  export type getWorker = (job_id:string, worker_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateWorker = (job_id:string, worker_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWorker = (job_id:string, worker_id:string, options?:object) => Promise<any>;
  export type getMaterials = (job_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (job_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (job_id:string, material_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateMaterial = (job_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (job_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getJobs = (options:object) => Promise<any[]>;
  export type createJob = (values:object, options?:object) => Promise<any>;
  export type getJob = (job_id:string, options:object) => Promise<any>;
  export type updateJob = (job_id:string, values:object, options:object) => Promise<any>;
  export type deleteJob = (job_id:string, options:object) => Promise<any>;
  export type getSubjobs = (job_id:string, options?:object) => Promise<any[]>;
  export type addSubjobs = (job_id:string, subjobs:string[]) => Promise<any[]>;
  export type getSubjob = (job_id:string, subjob_id:string, options?:object) => Promise<any>;
  export type updateSubjob = (job_id:string, subjob_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSubjob = (job_id:string, subjob_id:string, options?:object) => Promise<any>;
  export type getWorkers = (job_id:string, options?:object) => Promise<any[]>;
  export type addWorkers = (job_id:string, workers:string[]) => Promise<any[]>;
  export type getWorker = (job_id:string, worker_id:string, options?:object) => Promise<any>;
  export type updateWorker = (job_id:string, worker_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWorker = (job_id:string, worker_id:string, options?:object) => Promise<any>;
  export type getMaterials = (job_id:string, options?:object) => Promise<any[]>;
  export type addMaterials = (job_id:string, materials:string[]) => Promise<any[]>;
  export type getMaterial = (job_id:string, material_id:string, options?:object) => Promise<any>;
  export type updateMaterial = (job_id:string, material_id:string, values:object, options?:object) => Promise<any>;
  export type deleteMaterial = (job_id:string, material_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getJobs = [ IHandler, IHandler, IHandler ];
  export type createJob = [ IHandler, IHandler, IHandler ];
  export type getJob = [ IHandler, IHandler, IHandler ];
  export type updateJob = [ IHandler, IHandler, IHandler ];
  export type deleteJob = [ IHandler, IHandler, IHandler ];
  export type getSubjobs = [ IHandler, IHandler, IHandler ];
  export type addSubjobs = [ IHandler, IHandler, IHandler ];
  export type getSubjob = [ IHandler, IHandler, IHandler ];
  export type updateSubjob = [ IHandler, IHandler, IHandler ];
  export type deleteSubjob = [ IHandler, IHandler, IHandler ];
  export type getWorkers = [ IHandler, IHandler, IHandler ];
  export type addWorkers = [ IHandler, IHandler, IHandler ];
  export type getWorker = [ IHandler, IHandler, IHandler ];
  export type updateWorker = [ IHandler, IHandler, IHandler ];
  export type deleteWorker = [ IHandler, IHandler, IHandler ];
  export type getMaterials = [ IHandler, IHandler, IHandler ];
  export type addMaterials = [ IHandler, IHandler, IHandler ];
  export type getMaterial = [ IHandler, IHandler, IHandler ];
  export type updateMaterial = [ IHandler, IHandler, IHandler ];
  export type deleteMaterial = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    job: V.job;
    worker: V.worker;
    material: V.material;
    getJobs: V.getJobs;
    createJob: V.createJob;
    getJob: V.getJob;
    updateJob: V.updateJob;
    deleteJob: V.deleteJob;
    getSubjobs: V.getSubjobs;
    addSubjobs: V.addSubjobs;
    getSubjob: V.getSubjob;
    updateSubjob: V.updateSubjob;
    deleteSubjob: V.deleteSubjob;
    getWorkers: V.getWorkers;
    addWorkers: V.addWorkers;
    getWorker: V.getWorker;
    updateWorker: V.updateWorker;
    deleteWorker: V.deleteWorker;
    getMaterials: V.getMaterials;
    addMaterials: V.addMaterials;
    getMaterial: V.getMaterial;
    updateMaterial: V.updateMaterial;
    deleteMaterial: V.deleteMaterial;
  }

  export type repository = {
    getJobs: R.getJobs;
    createJob: R.createJob;
    getJob: R.getJob;
    updateJob: R.updateJob;
    deleteJob: R.deleteJob;
    getSubjobs: R.getSubjobs;
    addSubjobs: R.addSubjobs;
    getSubjob: R.getSubjob;
    updateSubjob: R.updateSubjob;
    deleteSubjob: R.deleteSubjob;
    getWorkers: R.getWorkers;
    addWorkers: R.addWorkers;
    getWorker: R.getWorker;
    updateWorker: R.updateWorker;
    deleteWorker: R.deleteWorker;
    getMaterials: R.getMaterials;
    addMaterials: R.addMaterials;
    getMaterial: R.getMaterial;
    updateMaterial: R.updateMaterial;
    deleteMaterial: R.deleteMaterial;
  }

  export type service = {
    getJobs: S.getJobs;
    createJob: S.createJob;
    getJob: S.getJob;
    updateJob: S.updateJob;
    deleteJob: S.deleteJob;
    getSubjobs: S.getSubjobs;
    addSubjobs: S.addSubjobs;
    getSubjob: S.getSubjob;
    updateSubjob: S.updateSubjob;
    deleteSubjob: S.deleteSubjob;
    getWorkers: S.getWorkers;
    addWorkers: S.addWorkers;
    getWorker: S.getWorker;
    updateWorker: S.updateWorker;
    deleteWorker: S.deleteWorker;
    getMaterials: S.getMaterials;
    addMaterials: S.addMaterials;
    getMaterial: S.getMaterial;
    updateMaterial: S.updateMaterial;
    deleteMaterial: S.deleteMaterial;
  }

  export type controller = {
    getJobs: C.getJobs;
    createJob: C.createJob;
    getJob: C.getJob;
    updateJob: C.updateJob;
    deleteJob: C.deleteJob;
    getSubjobs: C.getSubjobs;
    addSubjobs: C.addSubjobs;
    getSubjob: C.getSubjob;
    updateSubjob: C.updateSubjob;
    deleteSubjob: C.deleteSubjob;
    getWorkers: C.getWorkers;
    addWorkers: C.addWorkers;
    getWorker: C.getWorker;
    updateWorker: C.updateWorker;
    deleteWorker: C.deleteWorker;
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
