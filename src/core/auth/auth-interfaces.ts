import { IUserRepository } from '../users/users-interface';
import { IValidator } from 'src/utils/interfaces';

export interface IAuthRepository extends IUserRepository {
}

export interface IAuthService {
  signIn (options:{ username:string, password:string }):Promise<string|Error>
}

export interface IAuthController {
  signIn:any[]
}

export interface IAuthValidator {
  signIn:IValidator
}
