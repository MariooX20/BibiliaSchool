require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PassThrough } = require("stream");
const drive = require("../config/drive");

// ── Startup environment validation ─────────────────────────────────────────
const REQUIRED_ENV = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_FOLDER_ID",
];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.warn(
    `⚠️  Warning: Missing environment variables: ${missingEnv.join(", ")}`
  );
}

// ── App setup ───────────────────────────────────────────────────────────────
const app = express();
const port = process.env.PORT || 7000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
};

app.use(cors(corsOptions));

const { Readable } = require("stream");

// Apply JSON body parsing only to non-stream routes.
app.use((req, res, next) => {
  if (req.path.includes("upload-stream")) return next();
  express.json()(req, res, next);
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Biblia School API is running" });
});

/**
 * Get or create a user folder inside the root Google Drive folder.
 * @param {string} folderName  Display name of the folder to find/create.
 * @returns {Promise<string>} The folder ID.
 */
async function getOrCreateFolder(folderName) {
  const escapedName = folderName.replace(/'/g, "\\'");
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder'
        and name='${escapedName}'
        and '${process.env.GOOGLE_FOLDER_ID}' in parents
        and trashed=false`,
    fields: "files(id,name)",
  });

  if (response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  const folder = await drive.files.create({
    resource: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_FOLDER_ID],
    },
    fields: "id",
  });

  return folder.data.id;
}

/**
 * POST /upload-stream
 *
 * Receives the raw binary file body (up to 50MB) and uploads to Google Drive.
 * Query params: userId, userName, fileName, fileType
 */
app.post(
  /.*upload-stream$/,
  express.raw({ type: "*/*", limit: "50mb" }),
  async (req, res) => {
    try {
      const { userId, userName, fileName, fileType } = req.query;

      if (!userId || !userName || !fileName || !fileType) {
        return res.status(400).json({
          error: "Missing required query params: userId, userName, fileName, fileType",
        });
      }

      if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: "Uploaded file payload is empty." });
      }

      const folderName = `${userName} (${userId})`;
      const folderId = await getOrCreateFolder(folderName);

      const mediaBody = Readable.from(req.body);

      const response = await drive.files.create({
        resource: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: fileType,
          body: mediaBody,
        },
        fields: "id,name",
      });

      res.json({
        message: "Uploaded successfully",
        file: response.data,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message || "Failed to upload file to Google Drive." });
    }
  }
);

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});