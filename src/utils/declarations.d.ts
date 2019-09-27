declare module '@ncardez/datalizer' {
  class Datalizer {
    constructor(values: object, options?: object)
    validate(values:object): Promise<{
      query:any
      body:any
      params:any
      headers?:any
    }>
    puerco:string;
  }

  export = Datalizer;
}

declare module '@ncardez/datalizer/src/is' {
  type fn = (value:any) => boolean;
  export const promise:fn;
  export const string:fn;
  export const empty:fn;
  export const array:fn;
}
