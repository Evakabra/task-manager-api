const express = require('express')
const router = new express.Router()
const auth = require('../middleware/authentication')
const Task = require('../models/task')

router.post('/tasks',auth, async (req, res) => {
    //const task = new Task(req.body)
    //replacing above mentioned old solution by below one(as we are binding user with their task only)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
    //code with help to promise
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /task?sortBy=createdAt:asc/desc (any special character we can use . it's for splitting only)
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.Completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   
    }
    try {
         await req.user.populate(
             {
                 path: 'tasks',
                 match,
                 options:{
                     limit:  parseInt(req.query.limit),
                     skip: parseInt(req.query.skip),
                     sort
                 }
             }).execPopulate()     
        //also we can do
        //  const tasks = await Task.find({owner: req.user._id})
        //res.send(tasks)
         res.send(req.user.tasks)   
    } catch{
        res.status(500).send()
    }
    //code with help to promise
    // Task.find({}).then((task) => {
    //     res.send(task)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)
        //replacing above with below code
        const task = await Task.findOne({_id, owner: req.user._id}) 
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch{
        res.status(500).send()
    }
    //code with help to promise
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Description', 'Completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
        //const task = await Task.findById(req.params.id)      
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update] )
        await task.save()
        return res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)
    } catch (e) {
        return res.status(500).send()
    }
})


module.exports = router