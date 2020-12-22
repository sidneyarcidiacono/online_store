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

exports.postLogin = (req, res, next) => {
  User.findById("5fe0079b08f2566ec88854db")
    .then(user => {
      req.session.isAuthenticated = true
      req.session.user = user
      res.redirect('/')
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
