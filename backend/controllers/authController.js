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
        // Step 1: Exchange the authorization code for an access token
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.CALLBACK_URL
            }
        });

        const accessToken = tokenResponse.data.access_token;
        req.session.accessToken = accessToken; // Store the access token in the session

        // Step 2: Use the access token to fetch user data from Twitch
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-ID': process.env.TWITCH_CLIENT_ID
            }
        });

        const userData = userResponse.data.data[0]; // Twitch returns user info in an array

        // Step 3: Store user data in the session
        req.session.user = {
            id: userData.id,
            displayName: userData.display_name,
            profileImage: userData.profile_image_url,
            email: userData.email
        };

        // Step 4: Redirect to the homepage
        res.redirect('/'); // Redirect to home after successful login

    } catch (error) {
        console.error('Error during authentication:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
};
