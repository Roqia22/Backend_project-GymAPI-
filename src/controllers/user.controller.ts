import type { Request, Response } from "express";
import  { type IUserDocument, User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user: IUserDocument): string => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }
    const token = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
        expiresIn: "1d"
    }
);
    return token
};

export const signUp = async (req: Request, res: Response) => {
    try{
        const {full_name, email, password, role }= req.body
        if(!full_name || !email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
      
        const saltRound = 10
        const hashedPassword = await bcrypt.hash(password, saltRound)
        const newUser = await User.create({
            full_name,
            email,
            password: hashedPassword,
            role
        })
        const token = generateToken(newUser);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000 
        });
        return res.status(201).json({ message: "User registered successfully", token })
    }catch(error){
        return res.status(500).json({ message: "Something went wrong" })
    }
};

export const signIn = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body
         if(!email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000 
        });
        return res.status(200).json({token})
    }catch(error){
        return res.status(500).json({ message: "Something went wrong" });
    }
};
