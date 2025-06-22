import mongoose, { Document, Schema } from 'mongoose';


interface IExpertAvailability extends Document {
    expertId: mongoose.Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}


const ExpertAvailabilitySchema: Schema<IExpertAvailability> = new Schema({
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
});


const ExpertAvailability = mongoose.model<IExpertAvailability>('ExpertAvailability', ExpertAvailabilitySchema);

export { ExpertAvailability, IExpertAvailability };