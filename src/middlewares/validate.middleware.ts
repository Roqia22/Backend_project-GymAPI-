import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { userRole } from "../models/users.model.js";

export interface JwtPayload {
    id: string;
    email: string;
    role: userRole;
};

export interface AuthRequest extends Request {
    user?: JwtPayload;
};

export const verifyToken = (token: string) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        return decoded
    }catch(error){
        throw new Error("Invalid or expired token")
    }
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Access denied. No token provided"})
    }

    const token = authHeader.split(" ")[1]
    try{
        req.user = verifyToken(token as string)
        next()
    }
    catch(error){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authZ =(allowedRole: userRole) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {    
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        if(req.user.role !== allowedRole){
            return res.status(403).json({message: "Forbidden"})
        }
        next()
};
};




