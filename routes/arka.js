const router = require('express').Router();

const menController = require('../controllers/men');
const fightsController = require('../controllers/fights');


router.get('/men', menController.getConfirmedMen);
router.post('/men', menController.createMan);

router.post('/fights', fightsController.orderFight);

module.exports = router;