const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Block / unblock user
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({
            message: "User status updated",
            isBlocked: user.isBlocked,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Change role
exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body; // admin | staff | customer

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        res.json({ message: "Role updated", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
