const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  console.log(`Is Authenticated? ${req.session.isAuthenticated}`)
  console.log(`Session user: ${req.session.user}`)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isAuthenticated
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
  User.findById("5fe0079b08f2566ec88854db")
    .then(user => {
      req.session.isAuthenticated = true
      req.session.user = user
      req.session.save(err => {
        console.log(err)
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
