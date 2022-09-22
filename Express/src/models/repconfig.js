const { DataTypes } = require("sequelize");
const sequelize = require("../routes/conectionMysql");

const Repconfig = sequelize.define("repconfig",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.CHAR
    },
    token:{
        type: DataTypes.CHAR
    },
    project:{
        type: DataTypes.SMALLINT
    }
});

module.exports = Repconfig;