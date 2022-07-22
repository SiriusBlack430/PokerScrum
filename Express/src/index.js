const express = require("express");
const path = require('path'); // modulo para path
const morgan = require('morgan'); // mensajes de peticiones http
const app = express(); // servidor
const cors = require('cors');
app.use(cors())

app.use(express.json());
app.set('port', 3001); // puerto en el que escucha

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

// rutas
app.use("/", require("./routes"));


app.listen(app.get('port'), ()=>{
    console.log("Server Started")
})
