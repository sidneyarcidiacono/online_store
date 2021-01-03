const express = require('express')
const { body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login',
          [
            body('email')
            .isEmail()
            .withMessage('Please enter a valid email.'),
            body('password', 'Invalid password')
            .isLength({ min: 5, max: 15 })
            .isAlphanumeric()
          ],
          authController.postLogin
        )

router.get('/signup', authController.getSignup)

router.post('/signup',
          [
            body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
              // This will store our promise rejection as an error, and return a Boolean;
              return User.findOne({ email: value })
                .then(userDoc => {
                  if (userDoc) {
                    return Promise.reject('Email exists already, please pick a different one.')
                }
              })
            }),
            body('password', 'Please make sure your password is 5-15 characters and contains no special characters.')
            .isLength({min: 5, max: 15})
            .isAlphanumeric(),
            body('confirmPassword')
            .custom((value, { req }) => {
              if (value !== req.body.password) {
                throw new Error('Passwords have to match.')
              }
              return true
            })
          ],
            authController.postSignup
          )

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router
