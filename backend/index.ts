import express from "express";
import cors from "cors";
import { saveFoodData } from "./services/foodService";
import { analyzeImageWithAnthropic } from "./services/anthropicService";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
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
