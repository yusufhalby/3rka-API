const router = require('express').Router();

const menController = require('../controllers/men');


router.get('/men', menController.geUnconfirmedtMen);
router.post('/men', menController.acceptMan);
router.delete('/men/:ManID', menController.deleteMan);


module.exports = router;