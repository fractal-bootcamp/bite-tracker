//seed the DB with some data just for testing

import prisma from "./prismaclient";

async function seed() {
  const user = await prisma.user.create({
    data: {
      clerkId: "user_2j3h4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z00",
    },
  });
  console.log("User created");
  await prisma.image.create({
    data: {
      userId: user.id,
      imageUrl: "https://example.com/image.jpg",
      foodItems: {
        create: [
          { name: "Chicken", calories: 100, carbs: 10, fat: 10, protein: 10 },
        ],
      },
    },
  });
  console.log("Image created");
}

seed();
