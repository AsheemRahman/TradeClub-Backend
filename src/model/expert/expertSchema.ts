import mongoose, { Schema, Document } from "mongoose";


interface IExpert extends Document {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    isVerified?: "Approved" | "Pending" | "Declined";
    isActive?: boolean;
    profilePicture?: string;
    DOB?: Date;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_Id?: string;
    stripeAccountId?: string;
}


const expertSchema = new Schema<IExpert>({
    fullName: {
        type: String,
        required: [true, 'First name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    isVerified: {
        type: String,
        enum: ["Approved", "Pending", "Declined"],
        default: "Pending",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    profilePicture: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    experience_level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
    },
    year_of_experience: {
        type: Number,
    },
    markets_Traded: {
        type: String,
        enum: ['Stock', 'Forex', 'Crypto', 'Commodities'],
    },
    trading_style: {
        type: String,
        enum: ['Scalping', 'Day Trading', 'Swing Trading', 'Position Trading'],
    },
    proof_of_experience: {
        type: String,
    },
    Introduction_video: {
        type: String,
    },
    Government_Id: {
        type: String,
    },
    selfie_Id: {
        type: String,
    },
    stripeAccountId: { 
        type: String, 
    },
}, { timestamps: true });

const Expert = mongoose.model<IExpert>("Expert", expertSchema);

export { Expert, IExpert };