import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { saveFoodData } from "./services/foodService";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Updated endpoint to handle base64 images and return structured food data
app.post(
  "/upload",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      console.log("Received upload request");

      const { image, userId } = req.body;
      // Add temporary user ID for testing
      const tempUserId = userId || "temp-user-123";

      console.log("Request body:", {
        hasImage: !!image,
        hasUserId: !!tempUserId,
        userId: tempUserId,
      });

      if (!image) {
        console.log("Missing image data in request");
        res.status(400).json({
          error: "Missing image data.",
          missing: {
            image: !image,
          },
        });
        return;
      }

      const base64Data = image;
      console.log("Base64 data received, length:", base64Data.length);

      // Initialize Anthropic client
      console.log("Initializing Anthropic client");
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
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
                  data: base64Data.split(",")[1],
                },
              },
              {
                type: "text",
                text: `Analyze this image and if it contains food, provide nutritional estimates in the following JSON format:
                {
                  "foodItems": [{
                    "name": string,
                    "calories": number,
                    "carbs": number,
                    "fat": number,
                    "protein": number
                  }]
                }
                
                If the image doesn't contain food, return { "foodItems": null }.
                Only return the JSON, no additional text.`,
              },
            ],
          },
        ],
      });

      const responseContent = message.content[0];
      const responseText =
        responseContent.type === "text" ? responseContent.text : "";

      // Parse the JSON response
      const foodData = JSON.parse(responseText);
      console.log("Structured food data:", foodData);

      // Save the food data to the database using tempUserId
      const savedImage = await saveFoodData(tempUserId, base64Data, foodData);

      res.json({
        message: "Image processed and data saved successfully",
        data: savedImage,
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
