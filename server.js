const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/errors')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById("5fdce27149dc2cdfd2d09bef")
  .then(user => {
    req.user = new User(user.name, user.email, user.cart, user._id)
    next()
  })
  .catch(err => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)


app.use(errorController.show404)

mongoConnect(() => {
  app.listen(3000)
})
