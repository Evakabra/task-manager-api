// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

//shorthand of above code
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'
// const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('unale to connect to database')
    }

    const db = client.db(database)

    //insert one and many
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'mahi',
    //     age: 24
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('unable to insert user')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'jane',
    //         age: 44
    //     },
    //     {
    //         name: 'piya',
    //         age: 22
    //     }
    // ], (error, result) => {
    //         if (error) {
    //             return console.log('unable to insert document')
    //         }
    //         console.log(result.ops)
    //     })

    // db.collection('users').findOne({ _id: new ObjectID("5f55210b11c47b17d4c78161") }, (error, user) => {
    //     if (error) {
    //         return console.log("Unable to fetch")
    //     }
    //     console.log(user)
    // })

    //read one and many
    //  db.collection('users').find({age: 24}).toArray((error,users) =>
    // {
    // console.log(users)
    // })

    // db.collection('users').find({age: 24}).count((error,count) =>
    // {
    // console.log(count)
    // })

    // db.collection('tasks').findOne({_id: new ObjectID("5f551ce8da2c1515b8b07584")},(error, users) =>
    // {
    //     console.log(users)
    // })

    // db.collection('tasks').find({isCompleted: false}).toArray((error,users) =>
    // {
    //     console.log(users)  
    // })

    //update one and many
    // db.collection('users').updateOne({
    //     _id: new ObjectID("5f5518604b63e00dbc906106")
    // },
    //     {
    //         $inc: {
    //             age: 1
    //         }
    //     }).then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     })

    // db.collection('tasks').updateMany({
    //     isCompleted: false
    // },
    // {
    //     $set: {
    //         isCompleted: true
    //     }
    // }).then((result) => {
    //    console.log(result.modifiedCount)
    // }).catch((error) => {
    //    console.log(error)
    // })

    //delete one and multiple
    // db.collection('users').deleteMany(
    //     {
    //         age: 24
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').deleteOne({
    //     description: 'Task completion status'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

})
