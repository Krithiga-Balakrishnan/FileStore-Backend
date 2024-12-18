const express = require("express");
const { listFilesAndGenerateUrls } = require("../services/s3Service");

const router = express.Router();

// GET /list-files?folderName=folder_name
router.get("/list-files", async (req, res) => {
    const { folderName } = req.query;

    if (!folderName) {
        return res.status(400).json({ message: "Folder name is required." });
    }

    try {
        const fileUrls = await listFilesAndGenerateUrls(folderName);
        res.status(200).json({ message: "Files retrieved successfully", files: fileUrls });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to list files", error: error.message });
    }
});

module.exports = router;
