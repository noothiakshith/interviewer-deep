import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logAccess } from "./src/services/userService"; // Circular Dependency!

const adapter = new PrismaPg({
  connectionString: "postgresql://postgres:postgres@localhost:5432/myapp",
});

export const prisma = new PrismaClient({
  adapter,
});

export const auditUserAccess = (userId: string) => {
  // Audit logic
  console.log("Auditing user access: ", userId);
};

