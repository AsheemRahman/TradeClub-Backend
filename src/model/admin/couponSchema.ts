import mongoose, { Schema, Document, model } from 'mongoose';


export interface ICoupon extends Document {
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    usageLimit?: number;
    usedCount: number;
    expiresAt: Date;
    isActive: boolean;
    target: 'all' | 'new_joiners' | 'specific_users' | 'premium_users' | 'first_purchase';
    applicableToUsers?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CouponSchema = new Schema<ICoupon>({
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });


const Coupon = model<ICoupon>('Coupon', CouponSchema);

export default Coupon;