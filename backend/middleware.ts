import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export const authmiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const autheader = req.headers.authorization;
        const token = autheader?.split(' ')[1];
        if (!token) {
            return res.status(418).json({ message: "You are not logged in" })
        }
        const decoded = jwt.verify(token, 'secret') as any;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
    }
}
