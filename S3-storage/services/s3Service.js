const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getContentType } = require("../utils/mimeUtils");

// Initialize the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// In-memory "database" for storing user info temporarily
const users = [];

// Function to create an S3 folder
async function createFolderInS3(folderName) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folderName}/`,
        ContentLength: 0,
    });
    await s3Client.send(command);
    return `${folderName}/`;
}

// Generate a pre-signed upload URL
async function generateUploadUrl(folderName, fileName) {
    const contentType = await getContentType(fileName);
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
        ContentType: contentType,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

// Handle user signup and folder creation
async function signup(username, email, folderName) {
    const exists = users.some((user) => user.username === username || user.email === email || user.folderName === folderName);

    if (exists) {
        throw new Error("Username, email, or folder name already exists.");
    }

    users.push({ username, email, folderName });
    const folderPath = await createFolderInS3(folderName);
    const uploadUrl = await generateUploadUrl(folderName, `sample-${Date.now()}.txt`);

    return { message: "Successfully signed up!", folderPath, uploadUrl };
}

// List files in a folder and generate pre-signed URLs
async function listFilesAndGenerateUrls(folderName) {
    const listCommand = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${folderName}/`,
    });

    const { Contents } = await s3Client.send(listCommand);
    if (!Contents || Contents.length === 0) return [];

    const fileUrls = await Promise.all(
        Contents.map(async (file) => {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.Key,
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            return { fileName: file.Key.replace(`${folderName}/`, ""), url };
        })
    );

    return fileUrls;
}

module.exports = { signup, listFilesAndGenerateUrls };
