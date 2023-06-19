const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get/', productController.getAll);
router.get('/get/:page', productController.getByPage);
router.post('/get/:page', productController.search);
router.get('/comparesupplier', productController.compareSupplier);
router.get('/getaveragemargin', productController.getAverageMargin);

router.delete('/deletelink', productController.deleteLink);
router.post('/addlink', productController.addLinkToProduct);

module.exports = router;