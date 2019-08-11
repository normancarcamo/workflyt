import { NotFoundError, ValidationError } from '@playscode/fns/lib/errors';
import { get } from '@playscode/fns';

export default function Methods(sequelize) {
  const { Op } = sequelize.Sequelize;

  this.findMany = function(_id, opts) {
    let criteria;

    if (Array.isArray(_id)) {
      criteria = {
        where: {
          id: {
            [Op.in]: _id
          }
        },
        ...opts
      };
    } else {
      criteria = {
        ...opts
      };
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
    let values = Array.isArray(_id) ? _id : [ _id ];
    return this.update(data, {
      where: {
        id: {
          [Op.in]: [ ...values ]
        }
      },
      ...opts
    });
  }

  this.destroyMany = function(_id, opts) {
    let value = Array.isArray(_id) ? _id : [ _id ];
    return this.destroy({
      where: {
        id: {
          [Op.in]: [ ...value ]
        }
      },
      ...opts
    });
  }

}
