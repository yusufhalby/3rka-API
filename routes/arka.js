const router = require('express').Router();
const { body } = require('express-validator');

const Men = require('../models/men');
const menController = require('../controllers/men');
const fightsController = require('../controllers/fights');
const isAuth = require('../middleware/is-auth');


router.get('/men', menController.getConfirmedMen);
router.post('/men', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom((value, {req}) => {
            return Men.findOne({where:{email: value}})
                .then(manDoc => {
                    if (manDoc) {
                        return Promise.reject('Email is already in use');
                    }
                })
        }),
        body('password')
        .trim()
        .isLength({min: 5}), 
        body('name')
        .trim()
        .notEmpty()
        .matches(/^[\u0600-\u06FF ]+$/u)
        .withMessage('Please use only arabic letters in name.'),
        body('uname')
        .trim()
        .notEmpty()
        .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/)
        .withMessage('Please use only english letters and numbers in username.')
        .custom((value, {req}) => {
            return Men.findOne({where:{uname: value}})
                .then(manDoc => {
                    if (manDoc) {
                        return Promise.reject('Username is already in use');
                    }
                })
        }),
        body('Phone')
        .trim()
        .notEmpty()
        .matches(/^[0][1][0-25][0-9]{8}$/)
        .withMessage('Please enter a valid egyptian phone number.')
        .custom((value, {req}) => {
            return Men.findOne({where:{Phone: value}})
                .then(manDoc => {
                    if (manDoc) {
                        console.log(value);
                        return Promise.reject('Phone number is already in use');
                    }
                })
        }),
        body('crecord')
        .trim()
        .notEmpty(),
        body('address')
        .trim()
        .notEmpty(),
        body('fav_weapon')
        .trim()
        .notEmpty()
], menController.createMan);

router.get('/fights', isAuth, fightsController.getConfirmedFights); 
router.post('/fights', [
    body('selectedIDs')
    .custom((value, {req}) => {
        if(!Array.isArray(value) || value.length === 0) throw new Error('You must select men to complete the order.');
        return Men.findAll({where:{ManID:value, isConfirmed: 1}})
        .then(men => {
            if (men.length !== value.length) return Promise.reject('Please do not play with requests');
        })
    }),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
        body('ClientName')
        .trim()
        .notEmpty()
        .matches(/^[\u0600-\u06FF ]+$/u)
        .withMessage('Please use only arabic letters in name.'),
        body('FightAddress')
        .trim()
        .notEmpty(),
        body('FightTime')
        .trim()
        .notEmpty()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
        .withMessage('Please enter a valid date and time.')
        .custom((value, {req}) => {
            if (new Date(value) < Date.now()+60*60*24) throw new Error('Fight must be after 24 hours at least.');
            return true;
        }),
        body('phone')
        .trim()
        .notEmpty()
        .matches(/^[0][1][0-25][0-9]{8}$/)
        .withMessage('Please enter a valid egyptian phone number.'),
        body('details')
        .trim()
        .notEmpty(),
], fightsController.orderFight);

router.post('/login', [
        body('uname')
        .trim()
        .notEmpty()
        .withMessage('Please enter valid username or email.'),
        body('password')
        .trim()
        .isLength({min: 5}), 
], menController.login);

module.exports = router;