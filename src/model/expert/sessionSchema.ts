import mongoose, { Document, Schema } from 'mongoose';

interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    expertId: mongoose.Types.ObjectId;
    availabilityId: mongoose.Types.ObjectId;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: Date;
    startedAt?: Date;
    endedAt?: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    availabilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpertAvailability',
        required: true
    },
    meetingLink: {
        type: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'missed'],
        default: 'upcoming'
    },
    bookedAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date
    },
    endedAt: {
        type: Date
    },
}, { timestamps: true });


const Session = mongoose.model<ISession>('Session', SessionSchema);


export { Session, ISession };