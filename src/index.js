const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT 

//app.use to customize our server
//express.json() its going to automatically pass incoming json to an object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const main = async() =>
// {
//     // const task = await Task.findById('5f6647283224e0438c27e3af')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5f66433361b62131940be9f5')   
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()