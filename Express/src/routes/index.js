const express = require('express')
const router = express.Router()
const pool = require("./conectionMysql")
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const issue = require('./issue')
const secret = 'SECRET'
const saltRounds = 10

pool.getConnection((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("DB connected")
})
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
// login check
router.post('/log',async (req,res)=>{
    const data = req.body
    const User = await pool.query("SELECT * FROM USER WHERE username= ?",data.username)
    if(User.length==0){
        res.sendStatus(404)
    }else{
        const compare = await bcrypt.compare(data.password,User[0].password)
        if(compare){          
            const token = generateAccessToken(data.username)
            const permiss = User[0].permiss
            const id = User[0].id
            res.send({token, permiss,id})
        }else{
            res.sendStatus(404)
        }  
    }
})

// register new user
router.post('/register', async (req, res)=>{
    const data = req.body;
    try{
        const User = await pool.query("SELECT * FROM USER WHERE username= ?",data.username)
        if(User.length !==0){
            res.sendStatus(404)
        }else{
            const hashedPassword = await bcrypt.hash(data.password,saltRounds)
            //const num = await pool.query("SELECT MAX(id) as id FROM USER")
            //await pool.query("ALTER TABLE USER AUTO_INCREMENT = ?",num[0].id)
            await pool.query("INSERT INTO USER(username,password,permiss) VALUES(?,?,?)",[data.username,hashedPassword,"USER"],function(e,result){
                if(e){
                    res.sendStatus(404)
                }    
                res.sendStatus(200)
            })
        }
    }catch(e){
        res.sendStatus(404)
    }  
})
//
router.post('/logged',async(req,res)=>{

    const id = req.body.id
    try{
        const data = await pool.query("SELECT repconfig_id from user_sala where user_id=?",id)
        const parseData = Object.values(JSON.parse(JSON.stringify(data)))
        let salaInfo =[]
        for(let i in parseData){ 
            const Info = await pool.query("SELECT id,name,programed_date,created_user_id from repconfig where id= ?",parseData[i]['repconfig_id'])
            salaInfo.push({id:Info[0].id, name:Info[0].name, programed_date:Info[0].programed_date,created_user_id:Info[0].created_user_id})
        }
        res.send(salaInfo)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/userList',authenticateToken,async (req, res)=>{
    const User = await pool.query("SELECT id,username,permiss FROM USER");

    res.send({User});
});

router.use(issue)
module.exports = router;