import { IAuthRepository, IAuthService } from './auth-interfaces';
import { IHelpers } from 'src/utils/interfaces';

export const AuthService = ({ repository, helpers }:{ repository:IAuthRepository, helpers:IHelpers }):IAuthService => ({
  async signIn ({ username, password }) {
    let user = await repository.getUserByUsernameWithRoles({ username });

    if (!user) {
      throw new Error('Forbidden');
    }

    await helpers.comparePassword({ raw: password, hash: user.password });

    user.sub = user.id;
    user.password = undefined;

    return helpers.signToken({ payload: user, secret: <string>process.env.JWT_SECRET });
  }
});
