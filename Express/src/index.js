const express = require('express')
const morgan = require('morgan') // mensajes de peticiones http
const cors = require('cors')

const app = express() // servidor
app.use(cors())

app.use(express.json())
app.set('port', 3001) // puerto en el que escucha

// middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))

// rutas
app.use('/api/v1/', require('./routes'))

app.listen(app.get('port'), () => {
  console.log('Server Started')
})
