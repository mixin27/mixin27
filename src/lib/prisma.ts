import { PrismaClient } from "./generated/prisma-client/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
    accelerateUrl: process.env.PRISMA_DATABASE_URL!,
}).$extends(withAccelerate());

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
