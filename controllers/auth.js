exports.getLogin = (req, res, next) => {
  console.log(req.session.isAuthenticated)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  req.session.isAuthenticated = true
  res.redirect('/')
}
