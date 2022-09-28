const express = require('express')
const router = express.Router()
const sequelize = require("./conectionMysql")
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const issue = require('./issue')
const User = require('../models/user');
const Repconfig = require('../models/repconfig');
const secret = 'SECRET'
const saltRounds = 10

try {
    sequelize.authenticate();
    User.sync();
    Repconfig.sync();
    console.log('DB connected');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

function generateAccessToken(username){
    return jwt.sign(username,secret)
}

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    try{
        const decodedUser = jwt.verify(token,secret)
        next()
    }catch(e){
        console.log("Token incorrecto")
    }
    
}

router.get('/index',async (req, res)=>{
    res.redirect("/index")
});

// login check
router.post('/log',async (req,res)=>{
    const data = req.body
    const user= await User.findAll({
        where: { username: data.username}
    })
    if(user.length==0){
        res.sendStatus(404)
    }else{
        const compare = await bcrypt.compare(data.password,user[0].password)
        if(compare){          
            const token = generateAccessToken(data.username)
            const permiss = user[0].permiss
            res.send({token, permiss})
        }else{
            res.sendStatus(404)
        }  
    }
})

// register new user
router.post('/register', async (req, res)=>{
    const data = req.body;
    try{
        const user= await User.findAll({
            where: { username: data.username}
        })
        if(user.length !==0){
            res.sendStatus(404)
        }else{
            const hashedPassword = await bcrypt.hash(data.password,saltRounds)
            try{
                await User.create({
                    username:data.username,
                    password:hashedPassword
                })
                res.sendStatus(200)
            } catch (err){
                res.sendStatus(404)
            }
        }
    }catch(e){
        res.sendStatus(404)
    }  
})

router.get('/userList',authenticateToken,async (req, res)=>{
    const user = await User.findAll()
    res.send({user})
});

router.use(issue)
module.exports = router;