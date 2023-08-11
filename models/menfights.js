const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Menfights = sequelize.define('menfights', {
    ManID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    FightID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Menfights;