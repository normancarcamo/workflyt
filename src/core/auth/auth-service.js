module.exports = ({ repository, validator, adapter }) => Object.freeze({
  async signIn (request) {
    let data = null;

    try {
      data = await validator.signIn.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C01H01-01';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.findUserWithRoles({
        username: data.body.username
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H01-02';
      return { success: false,  error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C01H01-03';
      return { success: false,  error: error };
    }

    let match = null;

    try {
      match = await adapter.comparePassword({
        passwordA: data.body.password,
        passwordB: user.password
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H01-04';
      return { success: false, error: error };
    }

    if (!match) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C01H01-05';
      return { success: false, error: error };
    }

    let token = null;

    try {
      user.sub = user.id;
      user.password = undefined;
      token = adapter.signToken({
        payload: user,
        secret: process.env.JWT_SECRET
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H01-06';
      return { success: false, error: error };
    }

    return { success: true, data: token };
  },

  async signUp (request) {
    let data = null;

    try {
      data = await validator.signUp.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C01H02-01';
      return { success: false, error: error };
    }

    let match = null;

    try {
      match = await repository.findUserByUsername({
        username: data.body.username
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H02-02';
      return { success: false, error: error };
    }

    if (match) {
      let error = new Error('Forbidden');
      error.status = 403;
      error.code = 'C01H02-03';
      return { success: false, error: error };
    }

    let passwordHash = null;

    try {
      passwordHash = await adapter.hashPassword({
        password: data.body.password,
        salt: 10
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H02-04';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.createUser({
        username: data.body.username,
        password: passwordHash
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H02-05';
      return { success: false, error: error };
    }

    let token = null;

    try {
      user.sub = user.id;
      user.password = undefined;
      token = adapter.signToken({
        payload: user,
        secret: process.env.JWT_SECRET
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C01H02-06';
      return { success: false, error: error };
    }

    return { success: true, data: token };
  }
});
