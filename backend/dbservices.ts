import type { User } from "@prisma/client";
import prisma from "./prismaclient";

export async function createUser(clerkId: string): Promise<User> {
  return prisma.user.create({
    data: { clerkId },
  });
}
