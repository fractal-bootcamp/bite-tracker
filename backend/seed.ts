//seed the DB with some data just for testing

import prisma from "./prismaclient";

async function seed() {
  const user =
    (await prisma.user.findUnique({
      where: {
        clerkId: "user_2pgKxjNaP0WMjeBSygEFhghgrA2",
      },
    })) ??
    (await prisma.user.create({
      data: {
        clerkId: "user_2pgKxjNaP0WMjeBSygEFhghgrA2",
      },
    }));
  console.log("User created");
  await prisma.image.create({
    data: {
      userId: user.id,
      imageUrl: "https://example.com/image.jpg",
      foodItems: {
        create: [
          { name: "Chicken", calories: 100, carbs: 10, fat: 10, protein: 10 },
          { name: "Beef", calories: 100, carbs: 10, fat: 10, protein: 10 },
          { name: "Pizza", calories: 50, carbs: 10, fat: 10, protein: 10 },
        ],
      },
    },
  });
  await prisma.image.create({
    data: {
      userId: user.id,
      imageUrl: "https://example.com/image2.jpg",
      foodItems: {
        create: [
          { name: "Lettuce", calories: 100, carbs: 10, fat: 10, protein: 10 },
          { name: "Tomato", calories: 100, carbs: 10, fat: 10, protein: 10 },
          { name: "Cheese", calories: 50, carbs: 10, fat: 10, protein: 10 },
        ],
      },
    },
  });
  console.log("Image created");
}

seed();
