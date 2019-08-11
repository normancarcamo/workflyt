module.exports = ({ repository, validator, adapter }) => Object.freeze({
  async getUsers (request) {
    if (!request.token.permissions.includes('get users')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getUsers.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C14H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createUsers (request) {
    if (!request.token.permissions.includes('create users')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createUsers.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H02-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByUsername({
        username: data.body.username
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H02-02';
      return { success: false, error: error };
    }

    if (user) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H02-03';
      return { success: false, error: error };
    }

    try {
      data.body.password = await adapter.hashPassword({
        password: data.body.password,
        salt: 10
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H02-04';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C14H02-05';
      return { success: false, error: error };
    }

    delete result.password;

    return { success: true, data: result };
  },

  async getUser (request) {
    if (!request.token.permissions.includes('get user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getUser.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H03-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({
        user_id: data.params.user,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H03-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H03-03';
      return { success: false, error: error };
    }

    delete user.password;

    return { success: true, data: user };
  },

  async updateUser (request) {
    if (!request.token.permissions.includes('update user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateUser.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H04-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H04-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        user_id: data.params.user,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteUser (request) {
    if (!request.token.permissions.includes('delete user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteUser.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H05-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H05-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        user_id: data.params.user,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getRoles (request) {
    if (!request.token.permissions.includes('get roles from user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H06-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getRoles.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H06-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H06-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getRoles({
        user: user,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addRoles (request) {
    if (!request.token.permissions.includes('add roles to user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H07-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addRoles.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H07-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H07-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addRoles({
        user_id: data.params.user,
        roles: data.body.roles
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getRole (request) {
    if (!request.token.permissions.includes('get role from user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H08-00';
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
      error.code = 'C14H08-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H08-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H08-03';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.getRole({
        user: user,
        role_id: data.params.role,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H08-04';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: role };
  },

  async updateRole (request) {
    if (!request.token.permissions.includes('update role from user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H09-00';
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
      error.code = 'C14H09-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H09-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H09-03';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.getRole({
        user: user,
        role_id: data.params.role
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H09-04';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateRole({
        user_id: data.params.user,
        role_id: data.params.role,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeRole (request) {
    if (!request.token.permissions.includes('remove role from user')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C14H10-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeRole.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C14H10-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findByPk({ user_id: data.params.user });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H10-02';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H10-03';
      return { success: false, error: error };
    }

    let role = null;

    try {
      role = await repository.getRole({
        user: user,
        role_id: data.params.role
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H10-04';
      return { success: false, error: error };
    }

    if (!role) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C14H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeRole({
        user_id: data.params.user,
        role_id: data.params.role,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C14H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
