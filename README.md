#  FileStore-Backend

A secure and scalable backend service for file storage using **AWS S3**, built with **Node.js**, **Express**, and **AWS SDK v3**. It supports user sign-up, folder creation, and file upload/download via **pre-signed URLs**.

---

##  Features

-  User sign-up with in-memory validation
-  Dynamic folder creation in AWS S3
-  Generate pre-signed URLs for secure uploads
-  List all files and fetch secure download links
-  Environment variable support using `.env`
-  Fully modular route and service separation

---

##  Tech Stack

- **Node.js** + **Express**
- **AWS SDK v3** (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- **dotenv** for environment config
- **MIME types** for content resolution

---

## 📁Folder Structure

```
FileStore-Backend/
├── S3-storage/
│   ├── routes/
│   │   ├── signupRoutes.js
│   │   └── fileRoutes.js
│   ├── services/
│   │   └── services.js
│   ├── utils/
│   │   └── mimeUtils.js
│   └── index.js
├── .env
├── server.js
├── package.json
└── README.md
```

---

##  Setup & Run

###  Prerequisites

- Node.js v18+
- AWS Account + IAM credentials
- An existing S3 bucket

###  Environment Variables (`.env`)

```env
PORT=3000
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name
```

### Installation

```bash
git clone https://github.com/Krithiga-Balakrishnan/FileStore-Backend.git
cd FileStore-Backend
npm install
npm start
```

---

##  API Endpoints

###  `POST /signup`
Create a user and generate a folder + upload URL.

```json
{
  "username": "krithiga",
  "email": "krithiga@example.com",
  "folderName": "krithiga-data"
}
```

**Response**
```json
{
  "message": "Successfully signed up!",
  "folderPath": "krithiga-data/",
  "uploadUrl": "https://..."
}
```

---

###  `GET /files/:folderName`
List files in the specified folder with secure URLs.

**Example:**  
`GET /files/krithiga-data`

**Response:**
```json
[
  {
    "fileName": "document.pdf",
    "url": "https://..."
  },
  ...
]
```

---

##  How It Works

1. `POST /signup` registers the user and creates an S3 folder.
2. A sample upload pre-signed URL is returned.
3. Files are listed by scanning the folder prefix and generating signed URLs.

---

##  Coming Soon

- MongoDB integration for persistent user management
- Authentication and role-based access control
- Frontend client (React or mobile) for upload & preview

---

##  Author

**Krithiga D. Balakrishnan**  
[GitHub](https://github.com/Krithiga-Balakrishnan) | [Portfolio](https://krithiga-balakrishnan.vercel.app)

---
