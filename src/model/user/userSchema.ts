import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    fullName: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    isActive?:boolean;
    googleID?: String
    profilePicture?: string;
}

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
        message: 'First name required',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        message: "Email is required",
    },
    password: {
        type: String,
        required: true,
        message: "Password is required",
    },
    phoneNumber: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    googleID: {
        type: String
    },
    profilePicture: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser };