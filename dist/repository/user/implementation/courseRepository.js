"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categorySchema_1 = __importDefault(require("../../../model/admin/categorySchema"));
const courseSchema_1 = __importDefault(require("../../../model/admin/courseSchema"));
const progressSchema_1 = require("../../../model/user/progressSchema");
class CourseRepository {
    async getCategory() {
        const category = await categorySchema_1.default.find().sort({ createdAt: -1 });
        return category;
    }
    ;
    async getCourse(filters) {
        const { search, category, minPrice, maxPrice, sort, page, limit } = filters;
        const query = { price: { $gte: minPrice, $lte: maxPrice } };
        if (category)
            query.category = category;
        if (search)
            query.title = { $regex: search, $options: 'i' };
        const sortOption = {};
        switch (sort) {
            case 'price-low':
                sortOption.price = 1;
                break;
            case 'price-high':
                sortOption.price = -1;
                break;
            case 'oldest':
                sortOption.createdAt = 1;
                break;
            default:
                sortOption.createdAt = -1;
        }
        const skip = (page - 1) * limit;
        // Fetch courses
        const [courses, totalCourses] = await Promise.all([
            courseSchema_1.default.find(query).sort(sortOption).skip(skip).limit(limit),
            courseSchema_1.default.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCourses / limit);
        return { courses, totalPages, totalCourses };
    }
    async getCourseById(courseId) {
        return courseSchema_1.default.findById(courseId);
    }
    ;
    async updateCourse(courseId, purchasedUsers) {
        const updatedCourse = await courseSchema_1.default.findByIdAndUpdate(courseId, { $addToSet: { purchasedUsers } }, { new: true });
        return updatedCourse;
    }
    ;
    async getCourseByUser(userId) {
        const course = await courseSchema_1.default.find({ purchasedUsers: userId });
        return course;
    }
    ;
    async getProgress(courseId, userId) {
        const progress = await progressSchema_1.CourseProgress.findOne({ user: userId, course: courseId });
        return progress;
    }
    ;
    async getAllProgress(userId) {
        const progress = await progressSchema_1.CourseProgress.find({ user: userId });
        return progress;
    }
    ;
    async createProgress(userId, courseId, progress, lastWatchedAt, totalCompletedPercent) {
        const newProgress = await progressSchema_1.CourseProgress.create({ user: userId, course: courseId, progress, totalCompletedPercent, lastWatchedAt });
        return newProgress;
    }
    ;
    async updateProgress(courseProgress) {
        const newProgress = await progressSchema_1.CourseProgress.findOneAndUpdate({ _id: courseProgress._id }, { $set: courseProgress }, { new: true });
        return newProgress;
    }
    ;
}
exports.default = CourseRepository;
//# sourceMappingURL=courseRepository.js.map