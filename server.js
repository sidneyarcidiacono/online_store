require('dotenv').config()
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/errors')
// const User = require('./models/user')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   User.findById("5fdce27149dc2cdfd2d09bef")
//   .then(user => {
//     req.user = new User(user.name, user.email, user.cart, user._id)
//     next()
//   })
//   .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.show404)

mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('CONNECTED')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
