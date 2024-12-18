const mime = require("mime");

async function getContentType(fileName) {
    return mime.getType(fileName) || "application/octet-stream";
}

module.exports = { getContentType };
