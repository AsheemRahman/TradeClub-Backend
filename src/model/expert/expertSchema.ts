import mongoose, { Schema, Document } from "mongoose";

interface IExpert extends Document {
    fullName: string;
    email: string;
    password: string;
    phone_number?: string;
    googleID?: string;
    isVerified?: boolean;
    profilePicture?: string;
    date_of_birth?: Date;
    state?: string;
    country?: string;
    experience_level?: 'Beginner' | 'Intermediate' | 'Expert';
    year_of_experience?: number;
    markets_Traded?: 'Stock' | 'Forex' | 'Crypto' | 'Commodities';
    trading_style?: 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Position Trading';
    proof_of_experience?: string;
    Introduction_video?: string;
    Government_Id?: string;
    selfie_with_Id?: string;
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
        required: [true, 'Password is required'],
    },
    phone_number: {
        type: String,
    },
    googleID: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
    },
    date_of_birth: {
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
    selfie_with_Id: {
        type: String,
    },
}, { timestamps: true });

const Expert = mongoose.model<IExpert>("Expert", expertSchema);

export { Expert, IExpert };
