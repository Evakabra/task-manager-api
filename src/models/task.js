const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    Description: {
        type: String,
        trim: true,
        required: true
    },
    Completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps : true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
















    //creating new instance of task and saving to db
// const addTask = new Task({
//     Description: 'cake decoration',
//     Completed: true
// })

// addTask.save().then(() => {
//     console.log(addTask)
// }).catch((error) => {
//     console.log(error)
// })