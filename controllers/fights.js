const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const Fights = require('../models/fights');
const Menfights = require('../models/menfights');
const Men = require('../models/men');

exports.orderFight = async (req, res, next) => {
    const {
        ClientName,
        FightAddress,
        FightTime,
        phone,
        details,
        email,
        selectedIDs
    } = req.body
    try {
        const fight = await Fights.create({
            ClientName,
            FightAddress,
            FightTime,
            phone,
            details,
            email
        });
        const FightID = fight.FightID;
        await selectedIDs.forEach(async ManID => {
            await Menfights.create({
                ManID,
                FightID
            });
        });
        return res.status(201).json({
            'message': 'success',
            fight
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getConfirmedFights = async (req, res, next) => {
    const {ManID} = req;
    try {
        const fights = await Menfights.findAll({
            include: {
                model: Fights,
                where: {
                    isConfirmed: 1
                },
                // attributes: [],
                attributes: ['ClientName', 'FightAddress', 'FightTime', 'phone', 'details', 'email'],
            },
            where: {
                ManID
            },
            attributes: ['FightID'],
            raw: true,
            nest: true,
        });
        if (fights.length == 0 || !fights) {
            const error = new Error('No fights found.');
            error.statusCode = 404;
            throw error;
        }
        const fightsIds = fights.map(f => {
            return f.FightID;
        });
        const fighters = await Menfights.findAll({
            include: [{
                model: Men,
                where: {
                    isConfirmed: 1
                },
                attributes: [
                    'name',
                    'ManID'
                ]
            }, ],
            attributes: ["FightID"],
            where: {
                FightID: fightsIds,
                ManID: {
                    [Op.ne]: ManID
                }
            }
        });
        fights.forEach(f => {
            f.men = [];
            fighters.forEach(m => {
                if (f.FightID == m.FightID && m.man.ManID != ManID) f.men.push(m.man)
            });
            const {
                FightID,
                fight,
                men
            } = f;
            Object.assign(f, fight);
            delete f.fight;
            f.FightID = FightID;
            f.men = men;
        });
        res.status(200).json({
            message: 'Fights fetched successfully',
            fightCount: fightsIds.length,
            fights
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.geUnconfirmedtFights = async (req, res, next) => {
    try {
        const fights = await Menfights.findAll({
            include: {
                model: Fights,
                where: {
                    isConfirmed: 0
                },
                attributes: ['ClientName', 'FightAddress', 'FightTime', 'phone', 'details', 'email'],
            },
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('fight.FightID')), 'FightID'],
            ],
            raw: true,
            nest: true,
        });
        if (fights.length == 0 || !fights) {
            const error = new Error('No fights found.');
            error.statusCode = 404;
            throw error;
        }
        const fightsIds = fights.map(f => {
            return f.FightID;
        });
        const fighters = await Menfights.findAll({
            include: [{
                model: Men,
                where: {
                    isConfirmed: 1
                },
                attributes: [
                    'name',
                    'ManID'
                ]
            }, ],
            attributes: ["FightID"],
            where: {
                FightID: fightsIds
            }
        });
        fights.forEach(f => {
            f.men = [];
            fighters.forEach(m => {
                if (f.FightID == m.FightID) f.men.push(m.man);
            });
            const {
                FightID,
                fight,
                men
            } = f;
            Object.assign(f, fight);
            delete f.fight;
            f.FightID = FightID;
            f.men = men;
        });
        res.status(200).json({
            message: 'Fights fetched successfully',
            fights
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.acceptFight = async (req, res, next) => {
    const {
        FightID
    } = req.body;
    try {
        const fight = await Fights.findByPk(FightID);
        if (!fight) {
            const error = new Error('No fight found.');
            error.statusCode = 404;
            throw error;
        }
        fight.isConfirmed = 1;
        const updatedFight = await fight.save();
        res.status(200).json({
            message: 'Fight was accepted successfully',
            fight: updatedFight
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteFight = async (req, res, next) => {
    const FightID = req.params.FightID;
    try {
        const fight = await Fights.findByPk(FightID);
        if (!fight) {
            const error = new Error('No fight found.');
            error.statusCode = 404;
            throw error;
        };
        await Menfights.destroy({
            where: {
                FightID
            }
        });
        await fight.destroy();
        res.status(200).json({
            message: 'Fight was deleted successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};