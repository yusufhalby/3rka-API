const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Fights = sequelize.define('fights', {
    FightID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ClientName: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    FightAddress: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    FightTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: false
    },
    details: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    isConfirmed: {
        type: Sequelize.TINYINT(1),
        default: 0
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Fights;