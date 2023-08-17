const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Men = sequelize.define('men', {
    ManID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Phone: {
        type: Sequelize.STRING(15),
        allowNull: false
    },
    uname: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    crecord: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    pfp: {
        type: Sequelize.STRING(255),
        defaultValue: null
    },
    address: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    fav_weapon: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    isConfirmed: {
        type: Sequelize.TINYINT(1),
        defaultValue: 0
    },
    price: {
        type: Sequelize.INTEGER(11),
        defaultValue: 0
    }
}, {
    timestamps: false
});

module.exports = Men;