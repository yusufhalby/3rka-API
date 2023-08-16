const router = require('express').Router();

const menController = require('../controllers/men');
const fightsController = require('../controllers/fights');

router.get('/men', menController.geUnconfirmedtMen);
router.patch('/men', menController.acceptMan);
router.delete('/men/:ManID', menController.deleteMan);

router.get('/fights', fightsController.geUnconfirmedtFights);
router.patch('/fights', fightsController.acceptFight);
router.delete('/fights/:FightID', fightsController.deleteFight);

module.exports = router;