import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type company = TSchema;
  export type getCompanies = IValidator;
  export type createCompany = IValidator;
  export type getCompany = IValidator;
  export type updateCompany = IValidator;
  export type deleteCompany = IValidator;
}

export namespace R {
  export type getCompanies = (options:object) => Promise<any[]>;
  export type createCompany = (values:object, options?:object) => Promise<any>;
  export type getCompany = (company_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateCompany = (company_id:string, values:object, options?:object) => Promise<any>;
  export type deleteCompany = (company_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getCompanies = (options:object) => Promise<any[]>;
  export type createCompany = (values:object, options?:object) => Promise<any>;
  export type getCompany = (company_id:string, options:object) => Promise<any>;
  export type updateCompany = (company_id:string, values:object, options:object) => Promise<any>;
  export type deleteCompany = (company_id:string, options:object) => Promise<any>;
}

export namespace C {
  export type getCompanies = [ IHandler, IHandler, IHandler ];
  export type createCompany = [ IHandler, IHandler, IHandler ];
  export type getCompany = [ IHandler, IHandler, IHandler ];
  export type updateCompany = [ IHandler, IHandler, IHandler ];
  export type deleteCompany = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    company: V.company;
    getCompanies: V.getCompanies;
    createCompany: V.createCompany;
    getCompany: V.getCompany;
    updateCompany: V.updateCompany;
    deleteCompany: V.deleteCompany;
  }

  export type repository = {
    getCompanies: R.getCompanies;
    createCompany: R.createCompany;
    getCompany: R.getCompany;
    updateCompany: R.updateCompany;
    deleteCompany: R.deleteCompany;
  }

  export type service = {
    getCompanies: S.getCompanies;
    createCompany: S.createCompany;
    getCompany: S.getCompany;
    updateCompany: S.updateCompany;
    deleteCompany: S.deleteCompany;
  }

  export type controller = {
    getCompanies: C.getCompanies;
    createCompany: C.createCompany;
    getCompany: C.getCompany;
    updateCompany: C.updateCompany;
    deleteCompany: C.deleteCompany;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
