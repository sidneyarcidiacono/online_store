const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
  console.log('In another middleware!')
  res.send('<form action="/product" method="POST"><input type="textname" name = "title"><button type="submit"></button></form>')
})

router.use('/product', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router
