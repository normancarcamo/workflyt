import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type worker = TSchema;
  export type job = TSchema;
  export type quote = TSchema;
  export type user = TSchema;
  export type getWorkers = IValidator;
  export type createWorker = IValidator;
  export type getWorker = IValidator;
  export type updateWorker = IValidator;
  export type deleteWorker = IValidator;
  export type getSupervisors = IValidator;
  export type addSupervisors = IValidator;
  export type getSupervisor = IValidator;
  export type updateSupervisor = IValidator;
  export type deleteSupervisor = IValidator;
  export type getJobs = IValidator;
  export type addJobs = IValidator;
  export type getJob = IValidator;
  export type updateJob = IValidator;
  export type deleteJob = IValidator;
  export type getQuotes = IValidator;
  export type getQuote = IValidator;
  export type getUser = IValidator;
}

export namespace R {
  export type getWorkers = (options:object) => Promise<any[]>;
  export type createWorker = (values:object, options?:object) => Promise<any>;
  export type getWorker = (worker_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateWorker = (worker_id:string, values:object, options?:object) => Promise<any>;
  export type deleteWorker = (worker_id:string, options?:object) => Promise<any>;
  export type getSupervisors = (worker_id:string, options?:object) => Promise<any[]>;
  export type addSupervisors = (worker_id:string, supervisors:string[]) => Promise<any[]>;
  export type getSupervisor = (worker_id:string, supervisor_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateSupervisor = (worker_id:string, supervisor_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSupervisor = (worker_id:string, supervisor_id:string, options?:object) => Promise<any>;
  export type getJobs = (worker_id:string, options?:object) => Promise<any[]>;
  export type addJobs = (worker_id:string, jobs:string[]) => Promise<any[]>;
  export type getJob = (worker_id:string, job_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateJob = (worker_id:string, job_id:string, values:object, options?:object) => Promise<any>;
  export type deleteJob = (worker_id:string, job_id:string, options?:object) => Promise<any>;
  export type getQuotes = (worker_id:string, options?:object) => Promise<any[]>;
  export type getQuote = (worker_id:string, quote_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type getUser = (worker_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getWorkers = (options:object) => Promise<any[]>;
  export type createWorker = (values:object, options?:object) => Promise<any>;
  export type getWorker = (worker_id:string, options:object) => Promise<any>;
  export type updateWorker = (worker_id:string, values:object, options:object) => Promise<any>;
  export type deleteWorker = (worker_id:string, options:object) => Promise<any>;
  export type getSupervisors = (worker_id:string, options?:object) => Promise<any[]>;
  export type addSupervisors = (worker_id:string, supervisors:string[]) => Promise<any[]>;
  export type getSupervisor = (worker_id:string, supervisor_id:string, options?:object) => Promise<any>;
  export type updateSupervisor = (worker_id:string, supervisor_id:string, values:object, options?:object) => Promise<any>;
  export type deleteSupervisor = (worker_id:string, supervisor_id:string, options?:object) => Promise<any>;
  export type getJobs = (worker_id:string, options?:object) => Promise<any[]>;
  export type addJobs = (worker_id:string, jobs:string[]) => Promise<any[]>;
  export type getJob = (worker_id:string, job_id:string, options?:object) => Promise<any>;
  export type updateJob = (worker_id:string, job_id:string, values:object, options?:object) => Promise<any>;
  export type deleteJob = (worker_id:string, job_id:string, options?:object) => Promise<any>;
  export type getQuotes = (worker_id:string, options?:object) => Promise<any[]>;
  export type getQuote = (worker_id:string, quote_id:string, options?:object) => Promise<any>;
  export type getUser = (worker_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getWorkers = [ IHandler, IHandler, IHandler ];
  export type createWorker = [ IHandler, IHandler, IHandler ];
  export type getWorker = [ IHandler, IHandler, IHandler ];
  export type updateWorker = [ IHandler, IHandler, IHandler ];
  export type deleteWorker = [ IHandler, IHandler, IHandler ];
  export type getSupervisors = [ IHandler, IHandler, IHandler ];
  export type addSupervisors = [ IHandler, IHandler, IHandler ];
  export type getSupervisor = [ IHandler, IHandler, IHandler ];
  export type updateSupervisor = [ IHandler, IHandler, IHandler ];
  export type deleteSupervisor = [ IHandler, IHandler, IHandler ];
  export type getJobs = [ IHandler, IHandler, IHandler ];
  export type addJobs = [ IHandler, IHandler, IHandler ];
  export type getJob = [ IHandler, IHandler, IHandler ];
  export type updateJob = [ IHandler, IHandler, IHandler ];
  export type deleteJob = [ IHandler, IHandler, IHandler ];
  export type getQuotes = [ IHandler, IHandler, IHandler ];
  export type getQuote = [ IHandler, IHandler, IHandler ];
  export type getUser = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    worker: V.worker;
    job: V.job;
    quote: V.quote;
    user: V.user;
    getWorkers: V.getWorkers;
    createWorker: V.createWorker;
    getWorker: V.getWorker;
    updateWorker: V.updateWorker;
    deleteWorker: V.deleteWorker;
    getSupervisors: V.getSupervisors;
    addSupervisors: V.addSupervisors;
    getSupervisor: V.getSupervisor;
    updateSupervisor: V.updateSupervisor;
    deleteSupervisor: V.deleteSupervisor;
    getJobs: V.getJobs;
    addJobs: V.addJobs;
    getJob: V.getJob;
    updateJob: V.updateJob;
    deleteJob: V.deleteJob;
    getQuotes: V.getQuotes;
    getQuote: V.getQuote;
    getUser: V.getUser;
  }

  export type repository = {
    getWorkers: R.getWorkers;
    createWorker: R.createWorker;
    getWorker: R.getWorker;
    updateWorker: R.updateWorker;
    deleteWorker: R.deleteWorker;
    getSupervisors: R.getSupervisors;
    addSupervisors: R.addSupervisors;
    getSupervisor: R.getSupervisor;
    updateSupervisor: R.updateSupervisor;
    deleteSupervisor: R.deleteSupervisor;
    getJobs: R.getJobs;
    addJobs: R.addJobs;
    getJob: R.getJob;
    updateJob: R.updateJob;
    deleteJob: R.deleteJob;
    getQuotes: R.getQuotes;
    getQuote: R.getQuote;
    getUser: R.getUser;
  }

  export type service = {
    getWorkers: S.getWorkers;
    createWorker: S.createWorker;
    getWorker: S.getWorker;
    updateWorker: S.updateWorker;
    deleteWorker: S.deleteWorker;
    getSupervisors: S.getSupervisors;
    addSupervisors: S.addSupervisors;
    getSupervisor: S.getSupervisor;
    updateSupervisor: S.updateSupervisor;
    deleteSupervisor: S.deleteSupervisor;
    getJobs: S.getJobs;
    addJobs: S.addJobs;
    getJob: S.getJob;
    updateJob: S.updateJob;
    deleteJob: S.deleteJob;
    getQuotes: S.getQuotes;
    getQuote: S.getQuote;
    getUser: S.getUser;
  }

  export type controller = {
    getWorkers: C.getWorkers;
    createWorker: C.createWorker;
    getWorker: C.getWorker;
    updateWorker: C.updateWorker;
    deleteWorker: C.deleteWorker;
    getSupervisors: C.getSupervisors;
    addSupervisors: C.addSupervisors;
    getSupervisor: C.getSupervisor;
    updateSupervisor: C.updateSupervisor;
    deleteSupervisor: C.deleteSupervisor;
    getJobs: C.getJobs;
    addJobs: C.addJobs;
    getJob: C.getJob;
    updateJob: C.updateJob;
    deleteJob: C.deleteJob;
    getQuotes: C.getQuotes;
    getQuote: C.getQuote;
    getUser: C.getUser;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
