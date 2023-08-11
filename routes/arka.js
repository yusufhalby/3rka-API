const router = require('express').Router();

const menController = require('../controllers/men');


router.get('/men', menController.getMen);


module.exports = router;