module.exports = ({ bcrypt, jsonwebtoken }) => Object.freeze({
  comparePassword: ({ passwordA, passwordB }) => {
    return bcrypt.compare(passwordA, passwordB);
  },
  hashPassword: ({ password, salt }) => {
    return bcrypt.hash(password, salt);
  },
  signToken: ({ payload, secret }) => {
    return jsonwebtoken.sign(payload, secret);
  }
});
