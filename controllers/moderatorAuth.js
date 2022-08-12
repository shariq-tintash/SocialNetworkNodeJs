const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Moderator = require('../models/moderator');
const ApiError = require('../errors/ApiError');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.unprocessable(errors.array());
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new Moderator({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  Moderator.findOne({ email: email })
    .then(user => {
      if (!user) {
        throw ApiError.unAuthorized("A moderator with this email could not be found.");
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        throw ApiError.unAuthorized("Wrong Passowrd");
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          moderatorId: loadedUser._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.status(200).json({ token: token, moderatorId: loadedUser._id.toString() });
    })
    .catch(err => {
        next(err);
    });
};
