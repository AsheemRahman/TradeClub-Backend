"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const CouponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minPurchaseAmount: {
        type: Number
    },
    usageLimit: {
        type: Number
    },
    usedCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    target: {
        type: String,
        enum: ['all', 'new_joiners', 'specific_users', 'premium_users', 'first_purchase'],
        default: 'all'
    },
    applicableToUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
}, { timestamps: true });
const Coupon = (0, mongoose_1.model)('Coupon', CouponSchema);
exports.Coupon = Coupon;
