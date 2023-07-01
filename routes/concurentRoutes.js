const express = require('express');
const router = express.Router();
const concurentController = require('../controllers/concurentController');
const Middle = require('../middlewares/authenticateToken')


router.get('/', Middle.authToken, concurentController.getAll);
router.get('/get/:page', Middle.authToken, concurentController.getByPage);
router.post('/get/:page', Middle.authToken, concurentController.search);
router.post('/create', Middle.authToken, concurentController.addConcurentLink);
router.delete('/:id', Middle.authToken, concurentController.deleteLink);
router.get('/compareconcurents', Middle.authToken, concurentController.compareConcurents);

module.exports = router;