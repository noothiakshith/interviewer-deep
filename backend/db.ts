import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: "postgresql://postgres:postgres@localhost:5432/myapp",
});

export const prisma = new PrismaClient({
  adapter,
});

