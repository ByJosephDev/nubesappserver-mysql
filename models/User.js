const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}
User.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    image: DataTypes.STRING,
},{
    sequelize,
    modelName: "user"
    
})

module.exports = User;