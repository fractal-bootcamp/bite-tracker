import Anthropic from "@anthropic-ai/sdk";

interface FoodData {
  foodItems:
    | {
        name: string;
        calories: number;
        carbs: number;
        fat: number;
        protein: number;
      }[]
    | null;
}

export async function analyzeImageWithAnthropic(
  base64Data: string
): Promise<FoodData> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const mediaTypeMatch = base64Data.match(
    /^data:(image\/(jpeg|png|gif|webp));base64,/
  );
  if (!mediaTypeMatch) {
    throw new Error("Invalid image format. Must be JPEG, PNG, GIF, or WebP.");
  }
  const mediaType = mediaTypeMatch[1] as
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp";

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
              media_type: mediaType,
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

  return JSON.parse(responseText);
}
