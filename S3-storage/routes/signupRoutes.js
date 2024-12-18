const express = require("express");
const { signup } = require("../services/s3Service");

const router = express.Router();

router.post("/", async (req, res) => {
    const { username, email, folderName } = req.body;

    if (!username || !email || !folderName) {
        return res.status(400).json({ message: "Username, email, and folder name are required." });
    }

    try {
        const result = await signup(username, email, folderName);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "An error occurred during signup." });
    }
});

module.exports = router;
