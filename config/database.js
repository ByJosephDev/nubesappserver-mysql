require('dotenv').config()
const { Sequelize } = require('sequelize');

const hostname = process.env.LOCALHOST_DATABASE.replace(/['"]+/g, '')

console.log(hostname);

const sequelize = new Sequelize(process.env.NAME_DATABASE, 
        'root' || process.env.USER_DATABASE, process.env.PASSWORD_DATABASE, {
        host: 'localhost' || hostname,
        dialect: 'mysql'
});

module.exports = sequelize;

