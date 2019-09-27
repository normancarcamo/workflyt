import { IValidator, IHandler, IUtils, TSchema } from 'src/utils/types';
import { Idatabase } from 'src/providers/postgres/types';
import { Router } from 'express';

export namespace V {
  export type client = TSchema;
  export type quote = TSchema;
  export type getClients = IValidator;
  export type createClient = IValidator;
  export type getClient = IValidator;
  export type updateClient = IValidator;
  export type deleteClient = IValidator;
  export type getQuotes = IValidator;
  export type getQuote = IValidator;
}

export namespace R {
  export type getClients = (options:object) => Promise<any[]>;
  export type createClient = (values:object, options?:object) => Promise<any>;
  export type getClient = (client_id:string, options?:object|null, throwNotFound?:boolean) => Promise<any>;
  export type updateClient = (client_id:string, values:object, options?:object) => Promise<any>;
  export type deleteClient = (client_id:string, options?:object) => Promise<any>;
  export type getQuotes = (client_id:string, options?:object) => Promise<any[]>;
  export type getQuote = (client_id:string, quote_id:string, options?:object, throwNotFound?:boolean) => Promise<any>;
}

export namespace S {
  export type getClients = (options:object) => Promise<any[]>;
  export type createClient = (values:object, options?:object) => Promise<any>;
  export type getClient = (client_id:string, options:object) => Promise<any>;
  export type updateClient = (client_id:string, values:object, options:object) => Promise<any>;
  export type deleteClient = (client_id:string, options:object) => Promise<any>;
  export type getQuotes = (client_id:string, options:object) => Promise<any[]>;
  export type getQuote = (client_id:string, quote_id:string, options:object) => Promise<any>;
}

export namespace C {
  export type getClients = [ IHandler, IHandler, IHandler ];
  export type createClient = [ IHandler, IHandler, IHandler ];
  export type getClient = [ IHandler, IHandler, IHandler ];
  export type updateClient = [ IHandler, IHandler, IHandler ];
  export type deleteClient = [ IHandler, IHandler, IHandler ];
  export type getQuotes = [ IHandler, IHandler, IHandler ];
  export type getQuote = [ IHandler, IHandler, IHandler ];
}

export namespace I {

  export type validator = {
    client: V.client;
    quote: V.quote;
    getClients: V.getClients;
    createClient: V.createClient;
    getClient: V.getClient;
    updateClient: V.updateClient;
    deleteClient: V.deleteClient;
    getQuotes: V.getQuotes;
    getQuote: V.getQuote;
  }

  export type repository = {
    getClients: R.getClients;
    createClient: R.createClient;
    getClient: R.getClient;
    updateClient: R.updateClient;
    deleteClient: R.deleteClient;
    getQuotes: R.getQuotes;
    getQuote: R.getQuote;
  }

  export type service = {
    getClients: S.getClients;
    createClient: S.createClient;
    getClient: S.getClient;
    updateClient: S.updateClient;
    deleteClient: S.deleteClient;
    getQuotes: S.getQuotes;
    getQuote: S.getQuote;
  }

  export type controller = {
    getClients: C.getClients;
    createClient: C.createClient;
    getClient: C.getClient;
    updateClient: C.updateClient;
    deleteClient: C.deleteClient;
    getQuotes: C.getQuotes;
    getQuote: C.getQuote;
  }

  export type helpers = IUtils;
}

export namespace F {

  export type repository = (database:Idatabase) => I.repository;

  export type service = (repository:I.repository) => I.service;

  export type controller = (service:I.service, validator:I.validator, helpers:I.helpers) => I.controller

  export type router = (controller:I.controller) => Router;

}
