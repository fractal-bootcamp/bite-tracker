import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Updated endpoint to handle base64 images
app.post(
  "/upload",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      console.log("Received upload request");

      if (!req.body.image) {
        console.log("No image data in request");
        res.status(400).json({ error: "No image data received." });
        return;
      }

      const base64Data = req.body.image;
      console.log("Base64 data received, length:", base64Data.length);

      // Initialize Anthropic client
      console.log("Initializing Anthropic client");
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY, // Make sure to add your API key to environment variables
      });

      console.log("Sending request to Claude Vision API");
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: base64Data.substring(
                    base64Data.indexOf(":") + 1,
                    base64Data.indexOf(";")
                  ),
                  data: base64Data.split(",")[1], // Remove the data:image/jpeg;base64, prefix
                },
              },
              {
                type: "text",
                text: "Describe this image.",
              },
            ],
          },
        ],
      });

      const responseContent = message.content[0];
      const responseText =
        responseContent.type === "text" ? responseContent.text : "";

      console.log("Received response from Claude:", responseText);
      res.json({
        message: "Image processed by Claude",
        response: responseText,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
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
