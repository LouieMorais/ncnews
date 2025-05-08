// Kata 9: GET /api/users
const { selectAllUsers } = require('../models/users.model');

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};