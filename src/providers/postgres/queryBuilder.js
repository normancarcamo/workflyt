module.exports = Op => {
  const isObject = x => Object.prototype.toString.call(x) === '[object Object]';

  const setOperator = data => {
    if (isObject(data)) {
      return Object.keys(data).reduce((acc, key) => {
        if (isObject(data[key])) {
          acc[key] = setOperator(data[key]);
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

  const queryBuilder = query => {
    let criteria = {};
    let options = {};
    let additional = [
      'attributes', 'include', 'force',
      'limit', 'offset', 'order_by',
      'paranoid', 'prematch','sort_by',
      'plain','raw','returning'
    ];

    for (let key in query) {
      if (additional.includes(key)) {
        options[key] = query[key];
      } else {
        criteria[key] = setOperator(query[key]);
      }
    }

    if (options.sort_by) {
      let order = [ options.sort_by, options.order_by || 'asc' ];
      options.sort_by = undefined;
      options.order_by = undefined;
      options.order = [ order ];
    }

    return Object.defineProperties({ where: criteria, ...options }, {
      options: { enumerable: false, value: options }
    });
  };

  return queryBuilder;
}
