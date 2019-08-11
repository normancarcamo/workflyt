module.exports = ({ bcrypt }) => Object.freeze({
  hashPassword: ({ password, salt }) => {
    return bcrypt.hash(password, salt);
  }
});
