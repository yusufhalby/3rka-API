const router = require('express').Router();

const menController = require('../controllers/men');
const fightsController = require('../controllers/fights');
const isAuth = require('../middleware/is-auth');


router.get('/men', menController.getConfirmedMen);
router.post('/men', menController.createMan);

router.get('/fights', isAuth, fightsController.getConfirmedFights); 
router.post('/fights', fightsController.orderFight);

router.post('/login', menController.login);

module.exports = router;