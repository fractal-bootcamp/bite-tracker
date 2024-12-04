import express, { type Request, type Response } from "express";
import multer from "multer";
import cors from "cors";
import { saveFoodData } from "./services/foodService";
import { analyzeImageWithAnthropic } from "./services/anthropicService";
import { PrismaClient } from "@prisma/client";
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
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Add CORS middleware
app.use(cors());

const prisma = new PrismaClient();

/**
 * TEMPORARY SOLUTION: Creating temporary users for each upload
 * TODO: Replace with proper auth using Clerk.js
 * Issues: No cleanup for temp users, accumulates in DB
 * See schema.prisma (lines 10-20) for User model structure
 */
app.post(
  "/upload",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      console.log("Received upload request");

      const { image } = req.body;

      // Create a temporary user first
      const tempUser = await prisma.user.create({
        data: {
          clerkId: `temp-${Date.now()}`, // Generate a unique temporary clerk ID
        },
      });

      console.log("Request body:", {
        hasImage: !!image,
        userId: tempUser.id,
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

      const foodData = await analyzeImageWithAnthropic(base64Data);
      console.log("Structured food data:", foodData);

      const savedImage = await saveFoodData(tempUser.id, base64Data, foodData);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
