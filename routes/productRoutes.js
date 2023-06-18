const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get/', productController.getAll);
router.get('/get/:page', productController.getByPage);
router.get('/comparesupplier', productController.compareSupplier)
router.get('/getaveragemargin', productController.getAverageMargin)

module.exports = router;