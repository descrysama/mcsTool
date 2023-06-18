const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.post('/', configController.addOrChangeConfig);
router.get('/get', configController.get);

module.exports = router;