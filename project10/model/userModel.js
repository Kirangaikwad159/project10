const {sequelize} = require('../config/connectDB');
const {DataTypes} = require('sequelize');

const userModel = sequelize.define(
    "User",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        status:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = userModel;