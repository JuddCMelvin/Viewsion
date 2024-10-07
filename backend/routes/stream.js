const express = require('express');
const { getStreamData } = require('../controllers/streamController');

const router = express.Router();

router.get('/', getStreamData); // Get stream data for the logged-in user

module.exports = router;
