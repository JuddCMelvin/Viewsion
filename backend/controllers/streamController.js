const axios = require('axios');

// Get stream data
exports.getStreamData = async (req, res) => {
    const accessToken = req.session.accessToken;

    if (!accessToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                user_login: 'viewsion' // Replace with your Twitch username
            }
        });

        res.json(streamResponse.data);
    } catch (error) {
        console.error('Error fetching stream data:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
};
