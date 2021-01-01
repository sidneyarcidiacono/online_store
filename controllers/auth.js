const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // Later, we'll show the user an error message so they know what went wrong
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isAuthenticated = true
            req.session.user = user
            return req.session.save(err => {
              console.log(err)
              res.redirect('/')
          })
        }
          // Later, we'll tell the user they entered the wrong password
          res.redirect('/login')
        })
        .catch(err => {
          // Later, we'll show the user an error message
          // We only make it in here if we get an error NOT if the passwords do not match.
          res.redirect('/login')
        })
      })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  // Alternatively, add "unique" to mongo schema to avoid another query/duplicate users with the same email
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        // Later, we'll work on showing the user a message to tell them what went wrong
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(result => {
          res.redirect('/login')
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
