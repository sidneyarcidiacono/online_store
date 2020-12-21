require('dotenv').config()
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/errors')
const User = require('./models/user')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById("5fe0079b08f2566ec88854db")
  .then(user => {
    req.user = user
    next()
  })
  .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.show404)

mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('CONNECTED')
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Sid',
          email: 'sid@test.com',
          cart: {
            items: []
          }
        })
      }
      user.save()
    })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
