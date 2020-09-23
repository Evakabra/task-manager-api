const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/authentication')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/account')
const {sendCancellationEmail} = require('../emails/account')
const multer = require('multer')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    //code with help to promise
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user , token })
    } catch (e) {
        res.status(400).send()
    }
})

//for fetching particular user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// for fetching all user
// router.get('/users', auth,  async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
//     //code with help to promise
//     // User.find({}).then((users) => {
//     //     res.send(users)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//now we don't want to get user by id, as we are only getting the user we want
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch{
//         res.status(500).send()
//     }
//     //code with help to promise
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        //no longer need to call by id as during authentication we already get our user
        //const user = await User.findById(req.params.id)
        updates.forEach((update) =>  req.user[update] = req.body[update])
        await req.user.save()
        //findByIdAndUpdate by passes middleware and performs operation directly on db. so we use findbyId
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        //replacing above code with below one
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        return res.send(req.user)
    } catch (e) {
        return res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
          return cb(new Error('Please upload a Image'))
        }
    cb(undefined, true)
    }
})
router.post('/users/me/avatar' , auth, upload.single('avatar'), async(req,res) =>
{
const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
req.user.avatar = buffer   
await req.user.save()
res.send()
},(error,req,res,next) =>
{
    res.status(400).send({error: error.message })
})

router.delete('/users/me/avatar', auth, async(req,res) =>{
   req.user.avatar = undefined
   await req.user.save()
   res.send()
})

router.get('/users/:id/avatar',async(req,res) =>
{
try{
     const user = await User.findById(req.params.id)
     if(!user || !user.avatar)
     {
        throw new Error()
     }
     res.set('Content-Type','image/png')
     res.send(user.avatar)
}catch{
    res.status(400).send()
}
})


module.exports = router
