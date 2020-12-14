const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://node_store_admin:dPiRzdrxAOQyZAEz@cluster0.gopsq.azure.mongodb.net/node_store?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected!')
    callback(client)
  })
  .catch(err => {
    console.log(err)
  })
}

module.exports = mongoConnect
