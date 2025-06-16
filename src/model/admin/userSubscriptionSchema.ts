import { model, Schema, Document, Types } from "mongoose";

export interface IUserSubscription extends Document {
    user: Types.ObjectId;
    subscriptionPlan: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    paymentId?: string;
    paymentStatus?: 'success' | 'pending' | 'failed';
    autoRenew?: boolean;
}

const userSubscriptionSchema = new Schema<IUserSubscription>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subscriptionPlan: {
            type: Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        paymentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: ['success', 'pending', 'failed'],
            default: 'pending',
        },
        autoRenew: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const UserSubscription = model<IUserSubscription>("UserSubscription", userSubscriptionSchema);

export default UserSubscription;
