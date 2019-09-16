module.exports = ({ repository, helpers }) => Object.freeze({
  async signIn ({ username, password }) {
    let user = await repository.getUserByUsernameWithRoles({ username });

    if (!user) {
      let error = new Error('Forbidden');
      error.status = 403;
      throw error;
    }

    await helpers.comparePassword({ raw: password, hash: user.password });

    user.sub = user.id;
    user.password = undefined;

    return helpers.signToken({ payload: user, secret: process.env.JWT_SECRET });
  }
});
