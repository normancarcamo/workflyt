import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type role = TSchema;
  export type permission = TSchema;
  export type getRoles = IValidator;
  export type createRole = IValidator;
  export type getRole = IValidator;
  export type updateRole = IValidator;
  export type deleteRole = IValidator;
  export type getPermissions = IValidator;
  export type addPermissions = IValidator;
  export type getPermission = IValidator;
  export type updatePermission = IValidator;
  export type deletePermission = IValidator;
}

export namespace R {
  export type getRoles = (options:object) => Promise<any[]>;
  export type createRole = (values:object, options?:object) => Promise<any>;
  export type getRole = (role_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateRole = (role_id:string, values:object, options?:object) => Promise<any>;
  export type deleteRole = (role_id:string, options?:object) => Promise<any>;
  export type getPermissions = (role_id:string, options?:object) => Promise<any[]>;
  export type addPermissions = (role_id:string, permissions:string[]) => Promise<any[]>;
  export type getPermission = (role_id:string, permission_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updatePermission = (role_id:string, permission_id:string, values:object, options?:object) => Promise<any>;
  export type deletePermission = (role_id:string, permission_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getRoles = (options:object) => Promise<any[]>;
  export type createRole = (values:object, options?:object) => Promise<any>;
  export type getRole = (role_id:string, options:object) => Promise<any>;
  export type updateRole = (role_id:string, values:object, options:object) => Promise<any>;
  export type deleteRole = (role_id:string, options:object) => Promise<any>;
  export type getPermissions = (role_id:string, options?:object) => Promise<any[]>;
  export type addPermissions = (role_id:string, permissions:string[]) => Promise<any[]>;
  export type getPermission = (role_id:string, permission_id:string, options?:object) => Promise<any>;
  export type updatePermission = (role_id:string, permission_id:string, values:object, options?:object) => Promise<any>;
  export type deletePermission = (role_id:string, permission_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getRoles = [ IHandler, IHandler, IHandler ];
  export type createRole = [ IHandler, IHandler, IHandler ];
  export type getRole = [ IHandler, IHandler, IHandler ];
  export type updateRole = [ IHandler, IHandler, IHandler ];
  export type deleteRole = [ IHandler, IHandler, IHandler ];
  export type getPermissions = [ IHandler, IHandler, IHandler ];
  export type addPermissions = [ IHandler, IHandler, IHandler ];
  export type getPermission = [ IHandler, IHandler, IHandler ];
  export type updatePermission = [ IHandler, IHandler, IHandler ];
  export type deletePermission = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    role: V.role;
    permission: V.permission;
    getRoles: V.getRoles;
    createRole: V.createRole;
    getRole: V.getRole;
    updateRole: V.updateRole;
    deleteRole: V.deleteRole;
    getPermissions: V.getPermissions;
    addPermissions: V.addPermissions;
    getPermission: V.getPermission;
    updatePermission: V.updatePermission;
    deletePermission: V.deletePermission;
  }

  export type repository = {
    getRoles: R.getRoles;
    createRole: R.createRole;
    getRole: R.getRole;
    updateRole: R.updateRole;
    deleteRole: R.deleteRole;
    getPermissions: R.getPermissions;
    addPermissions: R.addPermissions;
    getPermission: R.getPermission;
    updatePermission: R.updatePermission;
    deletePermission: R.deletePermission;
  }

  export type service = {
    getRoles: S.getRoles;
    createRole: S.createRole;
    getRole: S.getRole;
    updateRole: S.updateRole;
    deleteRole: S.deleteRole;
    getPermissions: S.getPermissions;
    addPermissions: S.addPermissions;
    getPermission: S.getPermission;
    updatePermission: S.updatePermission;
    deletePermission: S.deletePermission;
  }

  export type controller = {
    getRoles: C.getRoles;
    createRole: C.createRole;
    getRole: C.getRole;
    updateRole: C.updateRole;
    deleteRole: C.deleteRole;
    getPermissions: C.getPermissions;
    addPermissions: C.addPermissions;
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
