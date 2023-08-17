const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

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
            id: man.ManID
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

exports.login = async (req, res, next) => {
    const {uname, password} = req.body;
    try {
        const man = await Men.findOne({
            where: {isConfirmed: 1,
                [Op.or]: [{email: uname},{uname}]},
            attributes: [
            'pfp',
            'name',
            'uname',
            'password',
            'ManID'
        ],
        raw: true,
    });
        if (!man) {
            const error = new Error('Incorrect username or email or user not confirmed yet.');
            error.statusCode = 401;
            throw error;
        }
        if (md5(password) !== man.password ){
            const error = new Error('Incorrect password.');
            error.statusCode = 401;
            throw error;
        }
        delete man.password;
        const token = jwt.sign({
            id: man.ManID,
            role: 'user',
        }, 
        process.env.JWT_SECRET,
        {expiresIn: '5m'},
        );
        res.status(200).json({
            message: 'man fetched successfully',
            token,
            man
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