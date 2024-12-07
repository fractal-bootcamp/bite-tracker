// //seed the DB with some data just for testing

// import prisma from "./prismaclient";

// async function seed() {
//   const user =
//     (await prisma.user.findUnique({
//       where: {
//         clerkId: "user_2po4VCbt5K1jeeXMey1jIqXe02f",
//       },
//     })) ??
//     (await prisma.user.create({
//       data: {
//         clerkId: "user_2po4VCbt5K1jeeXMey1jIqXe02f",
//       },
//     }));
//   console.log("User created");
//   await prisma.image.create({
//     data: {
//       userId: user.id,
//       imageUrl: "https://example.com/image.jpg",
//       foodItems: {
//         create: [
//           { name: "Salmon", calories: 200, carbs: 0, fat: 13, protein: 22 },
//           { name: "Quinoa", calories: 120, carbs: 21, fat: 2, protein: 4 },
//           { name: "Broccoli", calories: 55, carbs: 11, fat: 0.6, protein: 4 },
//         ],
//       },
//     },
//   });
//   await prisma.image.create({
//     data: {
//       userId: user.id,
//       imageUrl: "https://example.com/image2.jpg",
//       foodItems: {
//         create: [
//           { name: "Avocado", calories: 160, carbs: 9, fat: 15, protein: 2 },
//           { name: "Egg", calories: 70, carbs: 1, fat: 5, protein: 6 },
//           {
//             name: "Brown Rice",
//             calories: 215,
//             carbs: 45,
//             fat: 1.5,
//             protein: 5,
//           },
//         ],
//       },
//     },
//   });
//   console.log("Image created");
// }
