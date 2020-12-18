const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    db = getDb()
    return db.collection('users').insertOne(this)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        err
      })
  }

  static findById(userId) {
    db = getDb()
    return db.collection('users').find({_id: ObjectId(userId)})
      .next()
      .then(user => {
        console.log(user)
        return user
      })
      .catch(err => {
        console.log(err)
      })
  }
}