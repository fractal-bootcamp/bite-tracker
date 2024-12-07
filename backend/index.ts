import express, { type Request, type Response } from "express";
import multer from "multer";
import cors from "cors";
import { saveFoodData } from "./services/foodService";
import { analyzeImageWithAnthropic } from "./services/anthropicService";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import { Webhook } from "svix";
import {
  createUser,
  getUserImagesAndFood,
  updateUserTargets,
} from "./dbservices";
import { requireAuth } from "@clerk/express";

console.log("Initializing Express");
const app = express();
const port = process.env.PORT || 3000;

// // Configure CORS
// app.use(
//   cors({
//     origin: ["http://localhost:8081", "http://localhost:19006"], // Add any other origins you need
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

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

app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

const prisma = new PrismaClient();

app.post(
  "/upload",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log("Received upload request");

      const { image } = req.body;
      const userId = req.auth?.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized/user id not provided" });
        return;
      }

      console.log("Request body:", {
        hasImage: !!image,
        userId: userId,
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

      // Get the user from the database using clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const savedImage = await saveFoodData(user.id, base64Data, foodData);

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
  "/update-targets",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.auth!.userId;
      const targets = req.body;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized/user id not provided" });
        return;
      }

      if (
        typeof targets !== "object" ||
        typeof targets.calories !== "number" ||
        typeof targets.protein !== "number" ||
        typeof targets.carbs !== "number" ||
        typeof targets.fat !== "number"
      ) {
        res.status(400).json({ error: "Invalid targets provided" });
        return;
      }

      const updatedUser = await updateUserTargets(userId, targets);

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user targets:", error);
      res.status(500).json({ error: "Failed to update targets" });
    }
  }
);

app.post(
  "/initialize-user",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.auth!.userId;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized/user id not provided" });
        return;
      }

      // Use Prisma to create the user if they don't exist
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {}, // No updates if user exists
        create: {
          clerkId: userId,
          // Add any default values you want
          calorieTarget: null,
          carbTarget: null,
          fatTarget: null,
          proteinTarget: null,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error initializing user:", error);
      res.status(500).json({ error: "Failed to initialize user" });
    }
  }
);

app.put(
  "/update-food-item/:id",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const foodItemId = req.params.id;
      const { nutrition } = req.body;
      const userId = req.auth!.userId;

      // Check if the food item belongs to the user through the image relationship
      const foodItem = await prisma.foodItem.findUnique({
        where: { id: foodItemId },
        include: {
          image: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!foodItem || foodItem.image.user.clerkId !== userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const updatedFoodItem = await prisma.foodItem.update({
        where: { id: foodItemId },
        data: {
          calories: nutrition.calories,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
          protein: nutrition.protein,
        },
      });

      res.json({
        success: true,
        data: updatedFoodItem,
      });
    } catch (error) {
      console.error("Error updating food item:", error);
      res.status(500).json({ error: "Failed to update food item" });
    }
  }
);

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
  };
}

app.get(
  "/user-food-history",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // The clerk middleware adds the auth property to req
      const userId = req.auth!.userId;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized/user id not provided" });
        return;
      }
      const userFoodHistory = await getUserImagesAndFood(userId);

      res.json({
        success: true,
        data: userFoodHistory,
      });
    } catch (error) {
      console.error("Error fetching user food history:", error);
      res.status(500).json({ error: "Failed to fetch food history" });
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
