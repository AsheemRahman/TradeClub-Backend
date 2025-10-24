"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgress = void 0;
const mongoose_1 = require("mongoose");
const videoProgressSchema = new mongoose_1.Schema({
    contentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const courseProgressSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const CourseProgress = (0, mongoose_1.model)('CourseProgress', courseProgressSchema);
exports.CourseProgress = CourseProgress;
