import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    isActive?:boolean;
    profilePicture?: string;
    lastSeen?: Date;
    createdAt?:Date;
}

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profilePicture: {
        type: String,
    },
    lastSeen: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser };