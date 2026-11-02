import mongoose, { Schema, Document } from "mongoose";


export interface IExpertEarning extends Document {
    expertId: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
    amount: number;
    status: "pending" | "paid";
    createdAt: Date;
    paidAt?: Date;
}


const expertEarningSchema = new Schema<IExpertEarning>({
    expertId: {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        required: true
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    amount: {
        type: Number,
        default: 100
    },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },
    paidAt: {
        type: Date
    },
}, { timestamps: true });


export default mongoose.model<IExpertEarning>("ExpertEarning", expertEarningSchema);