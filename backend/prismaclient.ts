//initialize prisma client
import { PrismaClient } from "@prisma/client";
console.log("Initializing Prisma Client");
const prisma = new PrismaClient();

export default prisma;
