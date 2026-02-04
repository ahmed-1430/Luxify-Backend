const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
    "407408718192.apps.googleusercontent.com"
);

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: "407408718192.apps.googleusercontent.com",
        });

        const payload = ticket.getPayload();

        const { email, name } = payload;

        //  If Google didn't send a name, generate one from email
        const finalName = name || email.split("@")[0];

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: finalName,
                email,
                password: Math.random().toString(36).slice(-8),
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ error: error.message });
    }
};
