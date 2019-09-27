import { IValidator, IHandler, IUtils } from 'src/utils/types';
import { I as IUser } from '../users/users-types';
import { Router } from 'express';

export namespace V {
  export type signIn = IValidator;
}

export namespace R {
}

export namespace S {
  export type signIn = (username: string, password: string) => Promise<string>;
}

export namespace C {
  export type signIn = [ IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    signIn: V.signIn;
  }

  export type repository = IUser.repository;

  export type service = {
    signIn: S.signIn;
  }

  export type controller = {
    signIn: C.signIn;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (User: IUser.repository) => I.repository;

  export type service = (repository:I.repository, helpers:I.helpers) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
