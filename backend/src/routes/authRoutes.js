const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/profile', (req, res) => authController.getProfile(req, res));

module.exports = router;
