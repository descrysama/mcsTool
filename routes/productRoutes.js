const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get/', productController.getAll);
router.get('/get/:page', productController.get);

module.exports = router;