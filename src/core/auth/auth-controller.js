module.exports = ({ service, validator, helpers }) => Object.freeze({
  signIn: [
    helpers.validateInput(validator.signIn),
    function handler (req, res, next) {
      let username = req.body.username;
      let password = req.body.password;
      service.signIn({ username, password })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
