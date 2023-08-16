const router = require('express').Router();

const menController = require('../controllers/men');
const fightsController = require('../controllers/fights');
const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');


router.get('/men', isAdmin, menController.geUnconfirmedtMen);
router.patch('/men', isAdmin, menController.acceptMan);
router.delete('/men/:ManID', isAdmin, menController.deleteMan);

router.get('/fights', isAdmin, fightsController.geUnconfirmedtFights);
router.patch('/fights', isAdmin, fightsController.acceptFight);
router.delete('/fights/:FightID', isAdmin, fightsController.deleteFight);

router.post('/login', adminController.login);

module.exports = router;