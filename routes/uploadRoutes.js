const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// helper to upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
    return await cloudinary.uploader.upload_stream(
        { folder: "luxify-products" },
        (error, result) => {
            if (error) throw error;
            return result;
        }
    );
};

// Upload single image
router.post(
    "/single",
    protect,
    authorize("admin"),
    upload.single("image"),
    async (req, res) => {
        try {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "luxify-products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    )
                    .end(req.file.buffer);
            });

            res.json({ url: result.secure_url });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Upload multiple images
router.post(
    "/multiple",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    async (req, res) => {
        try {
            const uploads = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: "luxify-products" },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result.secure_url);
                            }
                        )
                        .end(file.buffer);
                });
            });

            const urls = await Promise.all(uploads);

            res.json({ urls });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

module.exports = router;
