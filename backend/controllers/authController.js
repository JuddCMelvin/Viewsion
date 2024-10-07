const axios = require('axios');

// Redirect to Twitch for authorization
exports.authorizeTwitch = (req, res) => {
    const redirectUri = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code&scope=user:read:email`;
    res.redirect(redirectUri);
};

// Handle the callback from Twitch
exports.handleTwitchCallback = async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.CALLBACK_URL
            }
        });

        const accessToken = response.data.access_token;
        req.session.accessToken = accessToken; // Store in session

        // Redirect or respond
        res.redirect('/'); // Redirect to home after successful login
    } catch (error) {
        console.error('Error during authentication:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
};


