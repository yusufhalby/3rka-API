const Men = require('../models/men');

exports.getMen = async (req, res, next) =>{
    try {
        const men = await Men.findAll({
            where: {isConfirmed: 1},
            attributes: [
            'pfp',
            'name',
            'crecord',
            'fav_weapon',
            'price',
            'ManID'
        ]});
        if (men.length == 0 || !men) {
            const error = new Error('No men found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Men fetched successfully',
            men
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};