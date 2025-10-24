"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscription = void 0;
const mongoose_1 = require("mongoose");
const userSubscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriptionPlan: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const UserSubscription = (0, mongoose_1.model)("UserSubscription", userSubscriptionSchema);
exports.UserSubscription = UserSubscription;
