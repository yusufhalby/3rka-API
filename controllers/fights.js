const { Op } = require('sequelize');

const Fights = require('../models/fights');
const Menfights = require('../models/menfights');
const Men = require('../models/men');

exports.orderFight = async (req, res, next) =>{
    const {ClientName, FightAddress, FightTime, phone, details, email, selectedIDs} = req.body
    try{
    const fight = await Fights.create({ClientName, FightAddress, FightTime, phone, details, email});
    const FightID = fight.FightID;
    await selectedIDs.forEach(async ManID => {
        await Menfights.create({ManID, FightID});
    });
    return res.status(201).json({'message': 'success', fight});
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
};

exports.getConfirmedFights = async (req, res, next) =>{
    const ManID = req.params.ManID;
    try{
        const fights = await Menfights.findAll({
            include: {
                model: Fights,
                where: {isConfirmed: 1},
                // attributes: [],
                attributes: ['ClientName', 'FightAddress', 'FightTime', 'phone', 'details', 'email'],
            },
            where: {ManID},
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
        const men = await Menfights.findAll({
            include: [{
                model: Men,
                where: {isConfirmed: 1},
                attributes: [
                    'name',
                    'ManID'
                ]
            },
        ],
            attributes: ["FightID"],
            where: {FightID: fightsIds, ManID: {[Op.ne]: ManID}}
        });
        fights.forEach(f => {
            f.men = [];
            men.forEach(m => {
                if (f.FightID == m.FightID && m.man.ManID != ManID) f.men.push(m.man)
            });
        });
        res.status(200).json({message: 'Fights fetched successfully', fights});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};