import express, { type Request, type Response } from "express";
import multer from "multer";
import cors from "cors";
import { Webhook } from "svix";

const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  if (req.originalUrl === "/clerk-webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

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
      size: req.file.size,
    });

    res.json({
      message: `File uploaded: ${req.file.originalname}`,
    });
  }
);

app.post(
  "/clerk-webhook",
  express.raw({ type: "*/*" }),
  (req: express.Request, res: express.Response): void => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      res.status(500).send("Missing CLERK_WEBHOOK_SECRET");
      return;
    }
    if (
      typeof req.headers["svix-id"] !== "string" ||
      typeof req.headers["svix-timestamp"] !== "string" ||
      typeof req.headers["svix-signature"] !== "string"
    ) {
      console.warn("Missing svix headers/wrong types");
      res.status(400).send("Missing svix headers");
      return;
    }
    const header = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(secret);
    const payload = wh.verify(req.body, header);
    if (!payload) {
      console.warn("Invalid wh payload");
      res.status(400).send("Invalid payload");
      return;
    }
    res.sendStatus(200);
    return;
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
