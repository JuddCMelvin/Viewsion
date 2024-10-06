const express = require('express');

const router = express.Router();

// Get user data
router.get('/', (req, res) => {
    const user = req.session.user; // Assume user info is stored in session
    if (!user) {
        return res.status(401).send('Unauthorized');
    }
    res.json(user);
});

// Additional user-related routes can be added here

module.exports = router;
