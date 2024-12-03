import express, { type Request, type Response } from "express";
import multer from "multer";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { Webhook } from "svix";
import { createUser } from "./dbservices";

const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  if (req.originalUrl === "/clerk-webhook") {
    // makes sure that clerk webhook requests are not parsed as json
    // this is needed because for svix to verify the request,
    // the body needs to be the raw request body, not the parsed json
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Add CORS middleware
app.use(cors());

// Updated endpoint to handle base64 images and return structured food data
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

      res.json({
        message: "Image processed successfully",
        data: foodData,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  }
);

app.post(
  "/clerk-webhook",
  express.raw({ type: "*/*" }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      res.status(500).send("Missing CLERK_WEBHOOK_SECRET");
      return;
    }
    //check if svix headers are present and correct
    //svix is needed to verify the request is from clerk
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
    //verify the request is from clerk with svix
    const wh = new Webhook(secret);
    const payload = wh.verify(req.body, header);
    if (!payload) {
      console.warn("Invalid wh payload");
      res.status(400).send("Invalid payload");
      return;
    }
    //parse the request body as json
    const clerkEvent = JSON.parse(req.body.toString());
    //check if the event is a user.created event
    if (clerkEvent.type === "user.created") {
      //haven't tested this if statement yet
      const clerkId = clerkEvent.data.id;
      //create the new user in our database
      await createUser(clerkId);
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
