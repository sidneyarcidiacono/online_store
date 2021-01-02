const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')

const User = require('../models/user')


exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', "Invalid email or password")
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
          req.flash('error', "Invalid email or password")
          res.redirect('/login')
        })
        .catch(err => {
          // We only make it in here if we get an error NOT if the passwords do not match.
          req.flash('error', "Something went wrong, please try again.")
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
        req.flash('error', "A user with this email already exists. Please try another.")
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
          // javascript
          sgMail.setApiKey(process.env.SENDGRID_API_KEY)
          const msg = {
            to: email, // Change to your recipient
            from: 'sid.arcidiacono@students.makeschool.com', // Change to your verified sender
            subject: 'Thank you for signing up!',
            text: 'We are glad you are here.',
            html: '<strong>Buy some snakes.</strong>',
          }
          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
      })
      .catch(err => console.log(err))
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/reset'), {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  }
}
