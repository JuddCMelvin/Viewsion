// Get user data
exports.getUserData = (req, res) => {
    const user = req.session.user; // Assume user info is stored in session
    if (!user) {
        return res.status(401).send('Unauthorized');
    }
    res.json(user);
};

// Additional user-related functions can be added here as needed.
