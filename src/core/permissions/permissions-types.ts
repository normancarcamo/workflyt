import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type permission = TSchema;
  export type getPermissions = IValidator;
  export type createPermission = IValidator;
  export type getPermission = IValidator;
  export type updatePermission = IValidator;
  export type deletePermission = IValidator;
}

export namespace R {
  export type getPermissions = (options:object) => Promise<any[]>;
  export type createPermission = (values:object, options?:object) => Promise<any>;
  export type getPermission = (permission_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updatePermission = (permission_id:string, values:object, options?:object) => Promise<any>;
  export type deletePermission = (permission_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getPermissions = (options:object) => Promise<any[]>;
  export type createPermission = (values:object, options?:object) => Promise<any>;
  export type getPermission = (permission_id:string, options:object) => Promise<any>;
  export type updatePermission = (permission_id:string, values:object, options:object) => Promise<any>;
  export type deletePermission = (permission_id:string, options:object) => Promise<any>;
}

export namespace C {
  export type getPermissions = [ IHandler, IHandler, IHandler ];
  export type createPermission = [ IHandler, IHandler, IHandler ];
  export type getPermission = [ IHandler, IHandler, IHandler ];
  export type updatePermission = [ IHandler, IHandler, IHandler ];
  export type deletePermission = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    permission: V.permission;
    getPermissions: V.getPermissions;
    createPermission: V.createPermission;
    getPermission: V.getPermission;
    updatePermission: V.updatePermission;
    deletePermission: V.deletePermission;
  }

  export type repository = {
    getPermissions: R.getPermissions;
    createPermission: R.createPermission;
    getPermission: R.getPermission;
    updatePermission: R.updatePermission;
    deletePermission: R.deletePermission;
  }

  export type service = {
    getPermissions: S.getPermissions;
    createPermission: S.createPermission;
    getPermission: S.getPermission;
    updatePermission: S.updatePermission;
    deletePermission: S.deletePermission;
  }

  export type controller = {
    getPermissions: C.getPermissions;
    createPermission: C.createPermission;
    getPermission: C.getPermission;
    updatePermission: C.updatePermission;
    deletePermission: C.deletePermission;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
