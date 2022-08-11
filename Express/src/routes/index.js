const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('./conectionMysql')
const issue = require('./issue')

const router = express.Router()
const secret = 'SECRET'
const saltRounds = 10

pool.getConnection((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('DB connected')
})

function generateAccessToken(username) {
  return jwt.sign(username, secret)
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  if (token === null || token === undefined) return res.sendStatus(401)
  try {
    const decodedUser = jwt.verify(token, secret)
    console.log(decodedUser)
    next()
  } catch (e) {
    console.log(e.message)
    res.sendStatus(401)
  }
}
// login check
router.post('/log', async (req, res) => {
  const data = req.body
  const User = await pool.query('SELECT * FROM USER WHERE username= ?', data.username)
  if (User.length === 0) {
    res.sendStatus(404)
  } else {
    const compare = await bcrypt.compare(data.password, User[0].password)
    if (compare) {
      const token = generateAccessToken(data.username)
      const { permiss } = User[0]
      const { id } = User[0]
      res.send({ token, permiss, id })
    } else {
      res.sendStatus(404)
    }
  }
})

// register new user
router.post('/register', async (req, res) => {
  const data = req.body
  try {
    const User = await pool.query('SELECT * FROM USER WHERE USERNAME= ?', data.username)
    if (User.length !== 0) {
      res.sendStatus(404)
    } else {
      const hashedPassword = await bcrypt.hash(data.password, saltRounds)
      await pool.query('INSERT INTO USER(USERNAME,PASSWORD,PERMISS) VALUES(?,?,?)', [data.username, hashedPassword, 'USER'], (e) => {
        if (e) {
          res.sendStatus(404)
        }
        res.sendStatus(200)
      })
    }
  } catch (e) {
    res.sendStatus(404)
  }
})
//
router.post('/logged', async (req, res) => {
  const { id } = req.body
  try {
    const data = await pool.query('SELECT SALA_ID FROM USER_SALA WHERE USER_ID=?', id)
    const parseData = Object.values(JSON.parse(JSON.stringify(data)))
    const salaInfo = []
    for (let i = 0; i < parseData.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const Info = await pool.query('SELECT ID,NAME,PROGRAMED_DATE,CREATED_USER_ID FROM SALA WHERE ID= ?', parseData[i].SALA_ID)
      salaInfo.push({
        id: Info[0].ID,
        name: Info[0].NAME,
        programed_date: Info[0].PROGRAMED_DATE.toLocaleString(),
        created_user_id: Info[0].CREATED_USER_ID,
      })
    }
    res.send(salaInfo)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.get('/userList', authenticateToken, async (req, res) => {
  const User = await pool.query('SELECT ID,USERNAME,PERMISS FROM USER')
  res.send({ User })
})

router.use(issue)
module.exports = router
