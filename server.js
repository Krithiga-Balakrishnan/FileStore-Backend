require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const signupRoutes = require("./S3-storage/routes/signupRoutes");
const fileRoutes = require("./S3-storage/routes/fileRoutes");

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/signup", signupRoutes);
app.use("/files", fileRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
