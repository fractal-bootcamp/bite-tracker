import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Updated endpoint to handle base64 images
app.post("/upload", (req: express.Request, res: express.Response): void => {
  if (!req.body.image) {
    res.status(400).json({ error: "No image data received." });
    return;
  }

  const base64Data = req.body.image;

  // Log details about the received data
  console.log("File details:", {
    size: `${((base64Data.length * 0.75) / 1024 / 1024).toFixed(2)} MB`, // Approximate size
    type: base64Data.substring(
      base64Data.indexOf(":") + 1,
      base64Data.indexOf(";")
    ),
  });

  res.json({
    message: `Image uploaded`,
    metadata: {
      size: `${((base64Data.length * 0.75) / 1024 / 1024).toFixed(2)} MB`,
      type: base64Data.substring(
        base64Data.indexOf(":") + 1,
        base64Data.indexOf(";")
      ),
    },
  });
});

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
