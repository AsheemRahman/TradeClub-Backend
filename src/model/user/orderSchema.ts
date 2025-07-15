import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    courseTitle: string;
    coursePrice: number;
    currency: string;
    stripeSessionId: string;
    paymentIntentId: string;
    paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema: Schema = new Schema<IOrder>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        courseTitle: {
            type: String,
            required: true,
        },
        coursePrice: {
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
            required: false,
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