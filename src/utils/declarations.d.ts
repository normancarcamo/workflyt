declare module '@ncardez/datalizer' {
  class Datalizer {
    constructor(values: object)
    validate(values:object):Promise<{
      query:any
      body:any
      params:any
      headers?:any
    }>
  }

  export = Datalizer
}
