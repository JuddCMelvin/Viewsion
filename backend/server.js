const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Step 1: Redirect to Twitch for authorization
app.get('/auth/twitch', (req, res) => {
    const redirectUri = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code&scope=user:read:email`;
    res.redirect(redirectUri);
});

// Step 2: Handle the redirect from Twitch
app.get('/auth/twitch/callback', async (req, res) => {
    const { code } = req.query; // Capture the authorization code

    try {
        // Step 3: Exchange the authorization code for an access token
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

        // Fetch user data using the access token
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const userData = userResponse.data.data[0]; // Access user data
        res.send(`
            <h1>Hello, ${userData.display_name}</h1>
            <img src="${userData.profile_image_url}" alt="${userData.display_name}" />
        `);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Basic endpoint for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
