const axios = require('axios');

// Get user data from Twitch API
exports.getUserData = async (req, res) => {
    // Check if access token exists in the session
    const accessToken = req.session.accessToken;
    if (!accessToken) {
        return res.status(401).send('Unauthorized: No access token found.');
    }

    try {
        // Fetch user info from Twitch API
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-ID': process.env.TWITCH_CLIENT_ID // Make sure this is set in your .env
            }
        });

        // Twitch API returns user info in an array
        const userData = response.data.data[0];

        // Optionally store user data in the session for future use
        req.session.user = {
            id: userData.id,
            displayName: userData.display_name,
            profileImage: userData.profile_image_url,
            email: userData.email
        };

        // Return user data as response
        res.json(req.session.user);

    } catch (error) {
        console.error('Error fetching user data from Twitch:', error);
        res.status(500).send('Error fetching user data from Twitch.');
    }
};

