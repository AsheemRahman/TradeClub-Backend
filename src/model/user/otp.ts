import mongoose, { Document } from 'mongoose';

interface OTPType extends Document {
    email: string;
    otp: string;
    createdAt?: Date; // This will be used for TTL index
}

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }, // TTL: 5 minutes
});

const OTP = mongoose.model<OTPType>("OTP", otpSchema);

export { OTP, OTPType };