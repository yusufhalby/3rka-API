const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Menfights = sequelize.define('menfights', {
    MantID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    FightID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Menfights;