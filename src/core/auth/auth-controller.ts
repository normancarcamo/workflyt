import { F } from './auth-types';

export const AuthController:F.controller = (service, validator, helpers) => ({
  signIn: [
    helpers.validateInput(validator.signIn),
    function handler (req, res, next) {
      let username:string = req.body.username;
      let password:string = req.body.password;
      service.signIn(username, password)
        .then((result:any) => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
