module.exports = ({ Datalizer }) => {
  const schema = {
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

  const signIn = new Datalizer(schema);

  const signUp = new Datalizer(schema);

  return Object.freeze({ signIn, signUp });
};
