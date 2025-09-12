// models/Notification.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'course' | 'consultation' | 'subscription' | 'system' | 'reminder';
    read: boolean;
    actionUrl?: string | null;
    priority?: 'low' | 'medium' | 'high';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    message: {
        type: String,
        required: true,
        maxlength: 500,
    },
    type: {
        type: String,
        enum: ['course', 'consultation', 'subscription', 'system', 'reminder'],
        default: 'system',
    },
    read: {
        type: Boolean,
        default: false,
        index: true,
    },
    actionUrl: {
        type: String,
        default: null,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
}, { timestamps: true, });

// Compound indexes for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
