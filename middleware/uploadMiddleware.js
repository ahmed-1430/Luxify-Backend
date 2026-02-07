const multer = require("multer");

// store files temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"), false);
        }
        cb(null, true);
    },
});

module.exports = upload;
