const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const Middle = require('../middlewares/authenticateToken')

router.post('/', Middle.authToken, configController.addOrChangeConfig);
router.get('/get', Middle.authToken, configController.get);

module.exports = router;