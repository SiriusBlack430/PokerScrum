const { Sequelize } = require('sequelize');
//const mysql = require('mysql'); // modulo para bbdd mysql
//const {promisify} = require('util');

const sequelize = new Sequelize('prueba', 'NormalUser', 'NormalUser', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;

/*
const pool = mysql.createPool({
    host: 'localhost',
    user : 'NormalUser',
    password: 'NormalUser',
    database: 'prueba'
})
pool.query = promisify(pool.query);
module.exports = pool;


CREATE DATABASE prueba;
use prueba;

DROP TABLE IF EXISTS USER;
CREATE TABLE USER(
    id int(10) primary key auto_increment,
    username VARCHAR(50),
    password VARCHAR(200),
    permiss VARCHAR(20)
    );
    INSERT INTO USERS(username,password,permiss,createdAt,updatedAt) VALUES("amy","$2b$10$B3aozsB.Dw1gFitnm8k3EulfBXrGikAxFMVrYJxHFHR6CjbZanZ0a","ADMIN",NOW(),NOW());
    
    INSERT INTO USERS(username,password,permiss,createdAt,updatedAt) VALUES("yo","$2b$10$B3aozsB.Dw1gFitnm8k3EulfBXrGikAxFMVrYJxHFHR6CjbZanZ0a","user",NOW(),NOW());


    DROP TABLE IF EXISTS REPCONFIG;
    CREATE TABLE REPCONFIG(
        id int(10) primary key auto_increment,
        name VARCHAR(50),
        token VARCHAR(200),
        project int(2)
        );
        
        */
        
//amy password =  $2b$10$B3aozsB.Dw1gFitnm8k3EulfBXrGikAxFMVrYJxHFHR6CjbZanZ0a