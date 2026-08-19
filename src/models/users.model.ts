import mongoose, { Schema, type HydratedDocument } from "mongoose";

export enum userRole {
    MEMBER = 'member',
    TRAINER = 'trainer'
};

export interface IUser {
    full_name: string;
    email: string;
    password: string;
    role: userRole;
};

export const userSchema = new Schema<IUser> ({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false 
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.MEMBER
    }
},{ timestamps: true });

export type IUserDocument = HydratedDocument<IUser>;
export const User = mongoose.model<IUser>("User", userSchema);
