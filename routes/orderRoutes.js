const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const Middle = require('../middlewares/authenticateToken')

router.get('/getall', Middle.checkUser, orderController.getAll);
router.post('/create', Middle.checkUser, orderController.create);

module.exports = router;