import { ValidationError, NotFoundError } from "@playscode/fns/lib/errors";
import db from "src/db/models";
import bcrypt from "bcrypt";
import validate from 'src/validations/Auth';

const { User } = db.sequelize.models;

export const signIn = [
  validate.signIn,
  async function(req, res, next) {
    try {
      let { username, password } = req.values.body;

      let user = await User.findOne({ where: { username } });

      if (!user) {
        throw new NotFoundError("user has not been found.", null);
      }

      let match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new ValidationError("user access is denied.");
      }

      delete user.dataValues.password;

      let cookie = { httpOnly: true, secure: true, signed: true };

      res.cookie("user_id", user.id, cookie);

      res.json({ data: user, error: false });
    } catch (error) {
      next(error);
    }
  }
];

export const signUp = [
  validate.signUp,
  async function(req, res, next) {
    try {
      let { username, password } = req.values.body;

      let user = await User.findOne({ where: { username } });

      if (user) {
        throw new ValidationError("user is already taken.");
      }

      res.status(201).json({
        data: await User.create({
          username,
          password: await bcrypt.hash(password, 10)
        }),
        error: false,
      });
    } catch (error) {
      next(error);
    }
  }
];
