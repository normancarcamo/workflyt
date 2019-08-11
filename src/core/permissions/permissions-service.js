module.exports = ({ repository, validator }) => Object.freeze({
  async getPermissions (request) {
    if (!request.token.permissions.includes('get permissions')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C09H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getPermissions.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C09H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C09H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createPermissions (request) {
    if (!request.token.permissions.includes('create permissions')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C09H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createPermissions.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C09H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C09H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getPermission (request) {
    if (!request.token.permissions.includes('get permission')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C09H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getPermission.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C09H03-01';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.findByPk({
        permission_id: data.params.permission,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C09H03-02';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C09H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: permission };
  },

  async updatePermission (request) {
    if (!request.token.permissions.includes('update permission')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C09H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updatePermission.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C09H04-01';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.findByPk({
        permission_id: data.params.permission
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C09H04-02';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C09H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        permission_id: data.params.permission,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C09H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deletePermission (request) {
    if (!request.token.permissions.includes('delete permission')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C09H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deletePermission.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C09H05-01';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.findByPk({
        permission_id: data.params.permission
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C09H05-02';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C09H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        permission_id: data.params.permission,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C09H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
