const express = require('express');
const { body } = require('express-validator');

const Moderator = require('../models/moderator');
const authController = require('../controllers/moderatorAuth');

const router = express.Router();


//	PUT /auth/signup
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Moderator.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

//	POST /auth/login
router.post('/login', authController.login);

module.exports = router;
