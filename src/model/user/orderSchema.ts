import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    itemId: mongoose.Types.ObjectId;
    type: 'Course' | 'SubscriptionPlan';
    title: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    paymentIntentId?: string;
    paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema: Schema = new Schema<IOrder>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['Course', 'SubscriptionPlan'],
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'type',
        },
        title: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        stripeSessionId: {
            type: String,
            required: true,
        },
        paymentIntentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'unpaid', 'pending', 'failed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order, IOrder };
