const fs = require('fs');
const path = require('path');

const Men = require('../models/men');
const md5 = require('md5');

exports.createMan = async (req, res, next) => {
    const {Phone, uname, name, password, email, crecord, address, fav_weapon} = req.body; //ManID => auto, pfp => file, 
    const hashedPass = md5(password);
    try {
        if(!req.file){
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const pfp = req.file.path.replace('\\', '/');
        const man = await Men.create({Phone, uname, name, password: hashedPass, email, crecord, address, fav_weapon, pfp});
        res.status(201).json({
            message: 'Man Created successfully',
            man
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getConfirmedMen = async (req, res, next) =>{
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

exports.geUnconfirmedtMen = async (req, res, next) =>{
    try {
        const men = await Men.findAll({
            where: {isConfirmed: 0},
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

exports.acceptMan = async (req, res, next) => {
    const {price, ManID} = req.body; 
    try {
        const man = await Men.findByPk(ManID);
        if(!man){
            const error = new Error('No man found.');
            error.statusCode = 404;
            throw error;
        }
        man.price = price;
        man.isConfirmed = 1;
        const updatedMan = await man.save();
        res.status(200).json({
            message: 'Man was accepted successfully',
            man: updatedMan
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteMan = async (req, res, next) => {
    const ManID = req.params.ManID;
    let pfp;
    try{
        const man = await Men.findByPk(ManID);
        if(!man){
            const error = new Error('No man found.');
            error.statusCode = 404;
            throw error;
        }
        pfp = man.pfp
        // await Menfights.destroy({where: {ManID}}); //only needed if we want to delete a confirmed man
        await man.destroy();
        clearImage(pfp);
        res.status(200).json({
            message: 'Man was deleted successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



//helper function
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};