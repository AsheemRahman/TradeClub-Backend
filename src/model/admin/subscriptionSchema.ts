import { model, Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
    name: string;
    price: number;
    duration: number;
    features: string[];
    accessLevel?: {
        expertCallsPerMonth?: number;
        videoAccess?: boolean;
        chatSupport?: boolean;
    };
    isActive: boolean;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    accessLevel: {
        expertCallsPerMonth: {
            type: Number,
            default: 0,
        },
        videoAccess: {
            type: Boolean,
            default: false,
        },
        chatSupport: {
            type: Boolean,
            default: false,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const SubscriptionPlan = model<ISubscriptionPlan>("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionPlan;