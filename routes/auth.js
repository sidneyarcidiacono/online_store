const express = require('express')
const { body } = require('express-validator')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login', authController.postLogin)

router.get('/signup', authController.getSignup)

router.post('/signup',
          [
            body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
              // This is a super random, arbitrary dummy example to demonstrate using the custom method.
              if (value === 'test@test.com') {
                throw new Error('This email address is forbidden.')
              }
              return true
            }),
            body('password', 'Please make sure your password is 5-15 characters and contains no special characters.')
            .isLength({min: 5, max: 15})
            .isAlphanumeric()
          ],
            authController.postSignup
          )

router.post('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router
