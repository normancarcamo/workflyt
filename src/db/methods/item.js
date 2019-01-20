import { NotFoundError, ValidationError } from '@playscode/fns/lib/errors';
import { get } from '@playscode/fns';

export default function ItemMethods(sequelize) {
  const { Op } = sequelize.Sequelize;

  // -------------------------------------------------------------------------- class level methods:

  this.findMany = function(type, _id, opts = {}) {
    let criteria;

    if (Array.isArray(_id)) {
      criteria = {
        where: {
          id: { [Op.in]: _id },
          ...type ? { type } : null,
          ...opts.criteria
        },
        ...opts.options
      };
    } else {
      criteria = {
        where: {
          ...type ? { type } : null,
          ...opts.criteria
        },
        ...opts.options
      };
    }

    return this.findAll(criteria);
  }

  this.createMany = function(data, opts) {
    return this[Array.isArray(data) ? 'bulkCreate' : 'create'](data, opts);
  }

  this.updateMany = function(type, data, _id, opts) {
    let id = Array.isArray(_id) ? _id : [ _id ];
    return this.update(data, {
      where: {
        ...type ? { type } : null,
        id: {
          [Op.in]: [ ...id ]
        }
      },
      ...opts
    });
  }

  this.destroyMany = function(type, _id, opts) {
    let id = Array.isArray(_id) ? _id : [ _id ];
    return this.destroy({
      where: {
        ...type ? { type } : null,
        id: {
          [Op.in]: [ ...id ]
        }
      },
      ...opts
    });
  }

  this.match = async function(_id, opts) {
    let result = await this.findAll({
      where: {
        ...JSON.parse(JSON.stringify(opts)),
        id: { [Op.in]: _id },
      },
      attributes: [ 'id' ],
      raw: true
    });
    let records = result.map(e => e.id);
    let differences = get.diff(_id, records);
    if (differences.length) {
      throw new ValidationError(`Some id's are not matching.`, {
        details: differences.map(record_id => new NotFoundError(
          `${this.name} not found.`, {
          value: record_id
        }))
      });
    } else{
      return;
    }
  }

  // -------------------------------------------------------------------------- instance level methods:

  this.prototype.findTypes = function (type, id, opts) {
    return this.getTypes({
      joinTableAttributes: [],
      where: {
        ...type ? { type } : null,
        id
      },
      ...opts
    });
  }
}
