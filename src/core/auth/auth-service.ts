import { F } from './auth-types';

export const AuthService:F.service = (repository, helpers) => ({
  signIn: async function (username, password) {
    let user = await repository.getUserByUsernameWithRoles(username);

    if (!user) {
      throw new Error('Forbidden');
    }

    await helpers.comparePassword(password, user.password);

    user.sub = user.id;
    user.password = undefined;

    return helpers.signToken(user, process.env.JWT_SECRET as string);
  }
});
