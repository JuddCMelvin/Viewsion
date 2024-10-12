const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const streamRoutes = require('./routes/stream');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Route setup
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stream', streamRoutes);

app.get('/', (req, res) => {
    console.log('Session Data:', req.session); // Log the session data

    if (req.session.accessToken) {
        // User is logged in, fetch user data from the session
        const userData = req.session.user; // Ensure user data is retrieved from session

        if (userData) {
            res.send(`
                <h1>Welcome to the Twitch Stream App!</h1>
                <p>You are logged in as <strong>${userData.displayName}</strong></p>
                <img src="${userData.profileImage}" alt="${userData.displayName}'s profile image" /><br>
                <a href="/api/stream">View Your Stream Data</a><br>
                <a href="/auth/logout">Logout</a>
            `);
        } else {
            res.send(`
                <h1>Welcome to the Twitch Stream App!</h1>
                <p>User data not found in session.</p>
                <a href="/auth/twitch">Login with Twitch</a>
            `);
        }
    } else {
        // User is not logged in
        res.send(`
            <h1>Welcome to the Twitch Stream App!</h1>
            <p>You are not logged in.</p>
            <a href="/auth/twitch">Login with Twitch</a>
        `);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
