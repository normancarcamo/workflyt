import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type user = TSchema;
  export type role = TSchema;
  export type getUsers = IValidator;
  export type createUser = IValidator;
  export type getUser = IValidator;
  export type updateUser = IValidator;
  export type deleteUser = IValidator;
  export type getRoles = IValidator;
  export type addRoles = IValidator;
  export type getRole = IValidator;
  export type updateRole = IValidator;
  export type deleteRole = IValidator;
}

export namespace R {
  export type getUsers = (options:object) => Promise<any[]>;
  export type createUser = (values:object, options?:object) => Promise<any>;
  export type getUser = (user_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type getUserByUsername = (username:string, options:object, throwNotFound?:boolean) => Promise<any>;
  export type getUserByUsernameWithRoles = (username:string, options?:object, throwNotFound?:boolean) => Promise<any>
  export type updateUser = (user_id:string, values:object, options?:object) => Promise<any>;
  export type deleteUser = (user_id:string, options?:object) => Promise<any>;
  export type getRoles = (user_id:string, options?:object) => Promise<any[]>;
  export type addRoles = (user_id:string, roles:string[]) => Promise<any[]>;
  export type getRole = (user_id:string, role_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateRole = (user_id:string, role_id:string, values:object, options?:object) => Promise<any>;
  export type deleteRole = (user_id:string, role_id:string, options?:object) => Promise<any>;
}

export namespace S {
  export type getUsers = (options:object) => Promise<any[]>;
  export type createUser = (values:any, options:object) => Promise<any>;
  export type getUser = (user_id:string, options:object) => Promise<any>;
  export type updateUser = (user_id:string, values:object, options:object) => Promise<any>;
  export type deleteUser = (user_id:string, options:object) => Promise<any>;
  export type getRoles = (user_id:string, options?:object) => Promise<any[]>;
  export type addRoles = (user_id:string, roles:string[]) => Promise<any[]>;
  export type getRole = (user_id:string, role_id:string, options?:object) => Promise<any>;
  export type updateRole = (user_id:string, role_id:string, values:object, options?:object) => Promise<any>;
  export type deleteRole = (user_id:string, role_id:string, options?:object) => Promise<any>;
}

export namespace C {
  export type getUsers = [ IHandler, IHandler, IHandler ];
  export type createUser = [ IHandler, IHandler, IHandler ];
  export type getUser = [ IHandler, IHandler, IHandler ];
  export type updateUser = [ IHandler, IHandler, IHandler ];
  export type deleteUser = [ IHandler, IHandler, IHandler ];
  export type getRoles = [ IHandler, IHandler, IHandler ];
  export type addRoles = [ IHandler, IHandler, IHandler ];
  export type getRole = [ IHandler, IHandler, IHandler ];
  export type updateRole = [ IHandler, IHandler, IHandler ];
  export type deleteRole = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    user: V.user;
    role: V.role;
    getUsers: V.getUsers;
    createUser: V.createUser;
    getUser: V.getUser;
    updateUser: V.updateUser;
    deleteUser: V.deleteUser;
    getRoles: V.getRoles;
    addRoles: V.addRoles;
    getRole: V.getRole;
    updateRole: V.updateRole;
    deleteRole: V.deleteRole;
  }

  export type repository = {
    getUsers: R.getUsers;
    createUser: R.createUser;
    getUser: R.getUser;
    getUserByUsername: R.getUserByUsername;
    getUserByUsernameWithRoles: R.getUserByUsernameWithRoles;
    updateUser: R.updateUser;
    deleteUser: R.deleteUser;
    getRoles: R.getRoles;
    addRoles: R.addRoles;
    getRole: R.getRole;
    updateRole: R.updateRole;
    deleteRole: R.deleteRole;
  }

  export type service = {
    getUsers: S.getUsers;
    createUser: S.createUser;
    getUser: S.getUser;
    updateUser: S.updateUser;
    deleteUser: S.deleteUser;
    getRoles: S.getRoles;
    addRoles: S.addRoles;
    getRole: S.getRole;
    updateRole: S.updateRole;
    deleteRole: S.deleteRole;
  }

  export type controller = {
    getUsers: C.getUsers;
    createUser: C.createUser;
    getUser: C.getUser;
    updateUser: C.updateUser;
    deleteUser: C.deleteUser;
    getRoles: C.getRoles;
    addRoles: C.addRoles;
    getRole: C.getRole;
    updateRole: C.updateRole;
    deleteRole: C.deleteRole;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository, helpers: I.helpers) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
