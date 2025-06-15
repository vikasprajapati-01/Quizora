import { PrismaClient } from "@prisma/client";
import "server-only";

declare global {
  // eslint-disable-next-line no-var
  var cacPrisma: PrismaClient;
}

export let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
}
else {
  if (!global.cacPrisma) {
    global.cacPrisma = new PrismaClient();
  }
  prisma = global.cacPrisma;
}