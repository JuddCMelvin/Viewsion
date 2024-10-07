const express = require('express');
const { getUserData } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUserData); // Get user data

module.exports = router;
