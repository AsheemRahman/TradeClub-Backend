"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseContentSchema = new mongoose_1.Schema({
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
});
const courseSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    purchasedUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    content: [courseContentSchema],
    isPublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
const Course = (0, mongoose_1.model)('Course', courseSchema);
exports.default = Course;
