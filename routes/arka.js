const router = require('express').Router();

const menController = require('../controllers/men');


router.get('/men', menController.getConfirmedMen);
router.post('/men', menController.createMan);


module.exports = router;