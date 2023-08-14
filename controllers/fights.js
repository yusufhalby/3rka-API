const Fights = require('../models/fights');
const Menfights = require('../models/menfights');

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