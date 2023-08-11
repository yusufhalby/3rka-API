const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

mysql.createConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    })
    .then((connection) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_SCHEMA};`);
    });

const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});


module.exports = sequelize;