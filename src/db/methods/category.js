import { NotFoundError, ValidationError } from '@playscode/fns/lib/errors';
import { get } from '@playscode/fns';

export default function CategoryMethods(sequelize) {
  const { Op } = sequelize.Sequelize;

  // -------------------------------------------------------------------------- Class level methods:

  this.findMany = function(_id, opts) {
    let criteria;

    if (Array.isArray(_id)) {
      criteria = { where: { id: { [Op.in]: _id } }, ...opts };
    } else {
      criteria = { ...opts };
    }

    return this.findAll(criteria);
  }

  this.createMany = function(data, opts) {
    return this[Array.isArray(data) ? 'bulkCreate' : 'create'](data, {
      individualHooks: true,
      hooks: true,
      ...opts
    });
  }

  this.updateMany = function(data, _id, opts) {
    let id = Array.isArray(_id) ? _id : [ _id ];
    return this.update(data, {
      where: {
        id: {
          [Op.in]: [ ...id ]
        }
      },
      ...opts
    });
  }

  this.destroyMany = function(_id, opts) {
    let id = Array.isArray(_id) ? _id : [ _id ];
    return this.destroy({
      where: {
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

}
