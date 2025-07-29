import { model, Schema, Document, Types } from "mongoose";

interface IUserSubscription extends Document {
    user: Types.ObjectId | string;
    subscriptionPlan: Types.ObjectId | string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    callsRemaining: number;
    paymentId?: string;
    paymentStatus?: 'paid' | 'pending' | 'failed';
    autoRenew?: boolean;
}

const userSubscriptionSchema = new Schema<IUserSubscription>({
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
    callsRemaining: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'pending',
    },
    autoRenew: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const UserSubscription = model<IUserSubscription>("UserSubscription", userSubscriptionSchema);

export { UserSubscription, IUserSubscription };