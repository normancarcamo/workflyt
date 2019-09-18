import { Model } from 'sequelize';

export interface IUserRepository {
  getUsers (options:any):Promise<[Model]|Error>
  createUser (options:{ values:object, options:object }):Promise<object|Error>
  getUser (options:{ user_id:string, options?:object, throwNotFound?:boolean }):Promise<Model|Error|any>
  getUserByUsername (options:{ username:string, options:object, throwNotFound?:boolean }):Promise<Model|Error|any>
  getUserByUsernameWithRoles (options:{ username:string, options?:object, throwNotFound?:boolean }):Promise<Model|Error|any>
  updateUser (options:{ user_id:string, values:object, options:object }):Promise<Model|Error>
  deleteUser (options:{ user_id:string, options:object }):Promise<Model|Error>
  getRoles (options:{ user_id:string, options:object }):Promise<Model|Error>
  addRoles (options:{ user_id:string, roles:string[] }):Promise<Model|Error>
  getRole (options:{ user_id:string, role_id:string, options?:object, throwNotFound?:boolean }):Promise<Model|Error|any>
  updateRole (options:{ user_id:string, role_id:string, values:object, options?:object }):Promise<Model|Error>
  deleteRole (options:{ user_id:string, role_id:string, options?:object }):Promise<Model|Error>
}
