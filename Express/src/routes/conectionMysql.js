const mysql = require('mysql'); // modulo para bbdd mysql
const {promisify} = require('util');

const pool = mysql.createPool({
    host: 'localhost',
    user : 'NormalUser',
    password: 'NormalUser',
    database: 'prueba'
})
pool.query = promisify(pool.query);

module.exports = pool;
/*
CREATE DATABASE prueba;
use prueba;

DROP TABLE IF EXISTS USER;
CREATE TABLE USER(
    id bigint unsigned primary key auto_increment,
    username VARCHAR(50),
    password VARCHAR(200),
    permiss VARCHAR(20)
);
INSERT INTO USER(username,password,permiss) VALUES("amy","$2b$10$B3aozsB.Dw1gFitnm8k3EulfBXrGikAxFMVrYJxHFHR6CjbZanZ0a","ADMIN");

DROP TABLE IF EXISTS REPCONFIG;
CREATE TABLE REPCONFIG(
    id bigint unsigned primary key auto_increment,
    login VARCHAR(50) not null,
    token VARCHAR(200) not null,
    project int(2) not null,
    type VARCHAR(50) not null,
    programed_date DATETIME,
    created_user_id bigint unsigned not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    name varchar(50) not null,
    foreign key(created_user_id) references user(id)
);

INSERT INTO REPCONFIG(login,token,project,type,created_user_id,name) VALUES("gps-plan","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",7,"organization",2,"mock room")

DROP TABLE IF EXISTS USER_SALA;
CREATE TABLE USER_SALA(
    user_id bigint unsigned,
    repconfig_id bigint unsigned,
    primary key(user_id,repconfig_id),
    foreign key (user_id) references user(id),
    foreign key (repconfig_id) references repconfig(id)
)

*/

 //amy password =  $2b$10$B3aozsB.Dw1gFitnm8k3EulfBXrGikAxFMVrYJxHFHR6CjbZanZ0a