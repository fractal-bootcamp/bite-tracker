import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Add CORS middleware
app.use(cors());

// Endpoint to upload images
app.post(
  "/upload",
  upload.single("image"),
  (req: express.Request, res: express.Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    console.log("File details:", {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      buffer: `${req.file.buffer.length} bytes`,
      encoding: req.file.encoding,
      fieldname: req.file.fieldname,
    });

    res.json({
      message: `File uploaded: ${req.file.originalname}`,
      metadata: {
        size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
        mimetype: req.file.mimetype,
      },
    });
  }
);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
