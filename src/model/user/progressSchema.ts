import { Document, Schema, model, Types } from 'mongoose';

interface IVideoProgress {
    contentId: Types.ObjectId;
    watchedDuration: number;
    isCompleted: boolean;
    lastWatchedAt?: Date;
}

interface ICourseProgress extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    progress: IVideoProgress[];
    totalCompletedPercent: number;
    lastWatchedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const videoProgressSchema = new Schema<IVideoProgress>({
    contentId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    watchedDuration: {
        type: Number,
        default: 0
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    lastWatchedAt: {
        type: Date
    }
}, { _id: false });

const courseProgressSchema = new Schema<ICourseProgress>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    progress: [videoProgressSchema],
    totalCompletedPercent: {
        type: Number,
        default: 0
    },
    lastWatchedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });


const CourseProgress = model<ICourseProgress>('CourseProgress', courseProgressSchema);

export { CourseProgress, IVideoProgress, ICourseProgress };