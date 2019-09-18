import { IUserRepository } from '../users/users-interface';

export const AuthRepository = ({ User }:{ User:IUserRepository }) => User;
