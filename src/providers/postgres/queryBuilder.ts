import { Op } from 'sequelize';

function filter (Op:any) {
  let isObject = (x: object): boolean =>
    Object.prototype.toString.call(x) === '[object Object]';

  return function onlyOperator (data: any): object {
    if (isObject(data)) {
      return Object.keys(data).reduce((acc:any, key:string) => {
        if (isObject(data[key])) {
          acc[key] = onlyOperator(data[key]);
        } else {
          if (key in Op) {
            acc[Op[key]] = data[key];
          }
        }
        return acc;
      }, {});
    } else {
      return data;
    }
  };
}

function build (filter:Function) {
  return function (query:any):object {
    let criteria:any = {};
    let options:any = {};
    let option:string;
    let additional:string[] = [
      'attributes', 'include', 'force',
      'limit', 'offset', 'order_by',
      'paranoid', 'prematch','sort_by',
      'plain','raw','returning'
    ];


    for (option in query) {
      if (additional.includes(option)) {
        options[option] = query[option];
      } else {
        criteria[option] = filter(query[option]);
      }
    }

    if (options.sort_by) {
      let order:string[] = [ options.sort_by, options.order_by || 'asc' ];
      options.sort_by = undefined;
      options.order_by = undefined;
      options.order = [ order ];
    }

    return Object.defineProperties({ where: criteria, ...options }, {
      options: { enumerable: false, value: options }
    });
  };
}

export default build(filter(Op));
