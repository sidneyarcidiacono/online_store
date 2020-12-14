const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/errors')
const mongoConnect = require('./util/database')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.show404)


mongoConnect((client) => {
  console.log(client)
  app.listen(3000)
})
