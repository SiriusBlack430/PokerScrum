const { DataTypes } = require("sequelize");
const sequelize = require("../routes/conectionMysql");

const User = sequelize.define("user",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username:{
        type: DataTypes.CHAR
    },
    password:{
        type: DataTypes.CHAR
    },
    permiss:{
        type: DataTypes.STRING
    }
})

module.exports = User;