// require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

// const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const mime = require("mime");
// const express = require("express");
// const bodyParser = require("body-parser");

// // Initialize Express app
// const app = express();
// app.use(bodyParser.json()); // Parse JSON body
// app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data


// // In-memory "database" for storing user info temporarily
// const users = [];


// // Create the S3 client using environment variables
// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
// });

// // Function to create an S3 folder
// async function createFolderInS3(folderName) {
//     const command = new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${folderName}/`, // Trailing slash to represent a folder
//         ContentLength: 0       // Empty folder
//     });

//     await s3Client.send(command);
//     // Generate folder reference
//     const folderPath = `${folderName}/`;
//     return folderPath;
// }

// // Signup route
// async function generateUploadUrl(folderName, fileName) {
//     const contentType = mime.getType(fileName) || "application/octet-stream";
//     const command = new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${folderName}/${fileName}`,
//         ContentType: contentType,
//     });
//     return getSignedUrl(s3Client, command, { expiresIn: 3600 });
// }



// app.post("/signup", async (req, res) => {
//     console.log("Request Body:", req.body); // Log request body for debugging
//     const { username, email, folderName } = req.body;

//     if (!username || !email || !folderName) {
//         return res.status(400).json({ message: "Username, email, and folder name are required." });
//     }
//     // Check for duplicates
//     const exists = users.some(
//         (user) => user.username === username || user.email === email || user.folderName === folderName
//     );
//     if (exists) {
//         return res.status(400).json({ message: "Username, email, or folder name already exists." });
//     }

//     try {
//         // Add user to mock database
//         users.push({ username, email, folderName });

//         // Create folder in S3
//         const folderPath = await createFolderInS3(folderName);

//         // Generate a pre-signed URL for upload
//         const uploadUrl = await generateUploadUrl(folderName, `sample-${Date.now()}.txt`);

//         res.status(201).json({
//             message: "Successfully signed up!",
//             folderPath: folderPath,
//             uploadUrl: uploadUrl,
//         });
//     } catch (error) {
//         console.error("Error during signup:", error.message);
//         res.status(500).json({ message: "An error occurred during signup." });
//     }
// });

// async function listFilesAndGenerateUrls(folderName) {
//     try {
//         // List all objects (files) inside the folder
//         const listCommand = new ListObjectsV2Command({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Prefix: `${folderName}/`, // List files only inside the specific folder
//         });

//         const { Contents } = await s3Client.send(listCommand);

//         // If no files found
//         if (!Contents || Contents.length === 0) {
//             return [];
//         }

//         // Generate pre-signed URLs for each file
//         const fileUrls = await Promise.all(
//             Contents.map(async (file) => {
//                 const getObjectCommand = new GetObjectCommand({
//                     Bucket: process.env.AWS_BUCKET_NAME,
//                     Key: file.Key,
//                 });
//                 const url = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 }); // 1 hour expiry
//                 return {
//                     fileName: file.Key.replace(folderName + "/", ""), // Remove folder path for cleaner output
//                     url: url,
//                 };
//             })
//         );

//         return fileUrls;
//     } catch (error) {
//         console.error("Error listing files:", error.message);
//         throw error;
//     }
// }

// app.get("/list-files", async (req, res) => {
//     const { folderName } = req.query;

//     if (!folderName) {
//         return res.status(400).json({ message: "Folder name is required." });
//     }

//     try {
//         const fileUrls = await listFilesAndGenerateUrls(folderName);

//         res.status(200).json({
//             message: "Files retrieved successfully",
//             files: fileUrls,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to list files", error: error.message });
//     }
// });


// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const signupRoutes = require("./routes/signupRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/signup", signupRoutes);
app.use("/files", fileRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



