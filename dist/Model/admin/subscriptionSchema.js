"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = void 0;
const mongoose_1 = require("mongoose");
const subscriptionPlanSchema = new mongoose_1.Schema({
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
const SubscriptionPlan = (0, mongoose_1.model)("SubscriptionPlan", subscriptionPlanSchema);
exports.SubscriptionPlan = SubscriptionPlan;
