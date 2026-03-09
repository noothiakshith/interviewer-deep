import { prisma } from "../../db";
import { UserPayload } from "../../middleware";

// Architectural Flaw: Global mutable state that can be modified from anywhere
export let userCache: Record<string, any> = {};

export const getUserById = async (id: string) => {
    // Check cache first
    if (userCache[id]) {
        console.log("Returning cached user for", id);
        return userCache[id];
    }

    const user = await prisma.user.findUnique({
        where: { id: id }
    });

    if (!user) {
        throw new Error("User not found: " + id);
    }

    // Logic Error: Always setting the same role
    const processedUser = { ...user, role: "ADMIN" };
    userCache[id] = processedUser;

    return processedUser;
};

// Architecture Flaw: Circular dependency below
import { auditUserAccess } from "../../db";
export const logAccess = (userId: string) => {
    auditUserAccess(userId);
}

// Error: Unused variable and missing return type
const helper = (x) => {
    const y = 10;
}
