/*import {
  ValidationError,
  NotFoundError,
  HttpError,
  InternalError,
  BadRequestError
} from "@playscode/fns/lib/errors";
import { body, validationResult } from "express-validator/check";
import db from "src/db/models";
import bcrypt from "bcrypt";

const validator = {
  username: body("username")
    .isString()
    .isLength({ min: 4 })
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('must be at least 4 chars long'),
  password: body("password")
    .isString()
    .isLength({ min: 4 })
    .not()
    .isEmpty()
    .trim()
    .escape()
    .withMessage('must be at least 4 chars long'),
  worker: body("worker_id")
    .isString()
    .trim()
    .not()
    .isEmpty()
    .isUUID()
    .withMessage('must be a UUID value'),
}

export const signUp = [
  validator.username,
  validator.password,
  validator.worker,
  async function(req, res, next) {
    const { Worker, Users } = db.sequelize.models;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new ValidationError("denied", { errors: errors.array() }));
    } else {
      try {
        const { worker_id, username, password } = req.body;
        const userIsTaken = await Users.findOne({ where: { username }});
        if (userIsTaken) {
          next(new ValidationError("`username` is already taken."));
        } else {
          res.status(201).json({
            success: true,
            payload: await Users.create({
              worker_id,
              username,
              password: await bcrypt.hash(password, 10)
            })
          });
        }
      } catch (err) {
        next(new InternalError(err.message));
      }
    }
  }
];

export const signIn = [
  validator.username,
  validator.password,
  async function(req, res, next) {
    const { Worker, Users } = db.sequelize.models;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new ValidationError("denied", { errors: errors.array() }));
    } else {
      try {
        const { username, password } = req.body;
        const user = await Users.findOne({ where: { username } });

        if (user) {
          const passValid = await bcrypt.compare(password, user.password);
          if (passValid) {
            res.cookie("user_id", user.id, {
              httpOnly: true,
              secure: req.app.get('env') === "production",
              signed: true,
            });
            res.status(200).json({ success: true, payload: user });
          } else {
            next(new ValidationError("access denied"));
          }
        } else {
          next(new NotFoundError("`username` was not found", null));
        }
      } catch (err) {
        next(new InternalError(err.message));
      }
    };
  }
];
*/
