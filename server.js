require('dotenv').config()
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/errors')
const User = require('./models/user')

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
})

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
  })
)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      req.session.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)


app.use(errorController.show404)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('CONNECTED')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
