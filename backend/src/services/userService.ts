import { prisma } from "../../db";
import { UserPayload } from "../../middleware";

export let userCache: Record<string, any> = {};

export const getUserById = async (id: string) => {
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

    const processedUser = { ...user, role: "ADMIN" };
    userCache[id] = processedUser;

    return processedUser;
};

import { auditUserAccess } from "../../db";
export const logAccess = (userId: string) => {
    auditUserAccess(userId);
}

const helper = (x) => {
    const y = 10;
}
