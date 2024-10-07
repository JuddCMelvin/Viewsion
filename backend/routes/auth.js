const express = require('express');
const { authorizeTwitch, handleTwitchCallback } = require('../controllers/authController');

const router = express.Router();

router.get('/twitch', authorizeTwitch); // Redirect to Twitch for authorization

router.get('/twitch/callback', handleTwitchCallback); // Handle the callback from Twitch

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to home after logout
    });
});

module.exports = router;
