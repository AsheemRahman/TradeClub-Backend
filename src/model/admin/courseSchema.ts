import { Document, Schema, model, Types } from 'mongoose';

export interface ICourseContent {
    title: string;
    videoUrl: string;
    duration: number; // in minutes
}

export interface ICourse extends Document {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: Types.ObjectId;
    purchasedUsers?: Types.ObjectId[];
    content: ICourseContent[];
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const courseContentSchema = new Schema<ICourseContent>(
    {
        title: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
    },
    { _id: false }
);


const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    purchasedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    content: [courseContentSchema],
    isPublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Course = model<ICourse>('Course', courseSchema);

export default Course;