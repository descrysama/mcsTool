const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Middle = require('../middlewares/authenticateToken')

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/checkauth', Middle.checkAuth);
router.get('/logout', userController.logout);

module.exports = router;