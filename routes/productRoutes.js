const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Middle = require('../middlewares/authenticateToken')

router.get('/get/', Middle.authToken, productController.getAll);
router.get('/get/:page', Middle.authToken, productController.getByPage);
router.post('/get/:page', Middle.authToken, productController.search);
router.get('/comparesupplier', Middle.authToken, productController.compareSupplier);
router.get('/getaveragemargin', Middle.authToken, productController.getAverageMargin);

router.delete('/deletelink', productController.deleteLink);
router.post('/addlink', productController.addLinkToProduct);

module.exports = router;