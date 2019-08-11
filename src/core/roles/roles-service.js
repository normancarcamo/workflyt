module.exports = ({ repository, validator }) => Object.freeze({
  async getRoles (request) {
    if (!request.token.permissions.includes('get roles')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getRoles.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C11H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createRoles (request) {
    if (!request.token.permissions.includes('create roles')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createRoles.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C11H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getRole (request) {
    if (!request.token.permissions.includes('get role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getRole.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H03-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({
        role_id: data.params.role,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H03-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: role };
  },

  async updateRole (request) {
    if (!request.token.permissions.includes('update role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateRole.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H04-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H04-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        role_id: data.params.role,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteRole (request) {
    if (!request.token.permissions.includes('delete role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteRole.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H05-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H05-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        role_id: data.params.role,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getPermissions (request) {
    if (!request.token.permissions.includes('get permissions from role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H06-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getPermissions.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H06-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H06-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getPermissions({
        role: role,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addPermissions (request) {
    if (!request.token.permissions.includes('add permissions to role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H07-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addPermissions.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H07-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H07-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addPermissions({
        role_id: data.params.role,
        permissions: data.body.permissions
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getPermission (request) {
    if (!request.token.permissions.includes('get permission from role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H08-00';
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
      error.code = 'C11H08-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H08-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H08-03';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.getPermission({
        role: role,
        permission_id: data.params.permission,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H08-04';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: permission };
  },

  async updatePermission (request) {
    if (!request.token.permissions.includes('update permission from role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H09-00';
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
      error.code = 'C11H09-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H09-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H09-03';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.getPermission({
        role: role,
        permission_id: data.params.permission
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H09-04';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updatePermission({
        role_id: data.params.role,
        permission_id: data.params.permission,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removePermission (request) {
    if (!request.token.permissions.includes('remove permission from role')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C11H10-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removePermission.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C11H10-01';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.findByPk({ role_id: data.params.role });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H10-02';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H10-03';
      return { success: false, error: error };
    }

    let permission = null;

    try {
      permission = await repository.getPermission({
        role: role,
        permission_id: data.params.permission
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H10-04';
      return { success: false, error: error };
    }

    if (!permission) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C11H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removePermission({
        role_id: data.params.role,
        permission_id: data.params.permission,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C11H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
