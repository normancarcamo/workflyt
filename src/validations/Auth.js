import Datalizer from "@ncardez/datalizer";
import { validate } from './index';

const schemaSignInSignUp = {
  body: {
    $type: 'object',
    $unknown: false,
    $empty: false,
    $length: 2,
    $message: 'Invalid data',
    $keys: {
      username: {
        $type: 'string',
        $min: 2,
        $max: 30,
        $empty: false,
        $trim: 'all',
        $message: 'Invalid username'
      },
      password: {
        $type: 'string',
        $min: 4,
        $max: 100,
        $empty: false,
        $trim: 'all',
        $message: 'Invalid password'
      }
    }
  }
};

const signIn = new Datalizer(schemaSignInSignUp);

const signUp = new Datalizer(schemaSignInSignUp);

export default {
  signIn: validate(signIn),
  signUp: validate(signUp)
}
