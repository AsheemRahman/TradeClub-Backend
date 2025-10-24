"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categorySchema_1 = __importDefault(require("../../../model/admin/categorySchema"));
const courseSchema_1 = __importDefault(require("../../../model/admin/courseSchema"));
const progressSchema_1 = require("../../../model/user/progressSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class CourseRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(courseSchema_1.default);
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categorySchema_1.default.find().sort({ createdAt: -1 });
            return category;
        });
    }
    ;
    getCourse(filters) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [courses, totalCourses] = yield Promise.all([
                courseSchema_1.default.find(query).sort(sortOption).skip(skip).limit(limit),
                courseSchema_1.default.countDocuments()
            ]);
            const totalPages = Math.ceil(totalCourses / limit);
            return { courses, totalPages, totalCourses };
        });
    }
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findById(courseId);
        });
    }
    ;
    updateCourse(courseId, purchasedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCourse = yield courseSchema_1.default.findByIdAndUpdate(courseId, { $addToSet: { purchasedUsers } }, { new: true });
            return updatedCourse;
        });
    }
    ;
    getCourseByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseSchema_1.default.find({ purchasedUsers: userId });
            return course;
        });
    }
    ;
    getProgress(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield progressSchema_1.CourseProgress.findOne({ user: userId, course: courseId });
            return progress;
        });
    }
    ;
    getAllProgress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield progressSchema_1.CourseProgress.find({ user: userId });
            return progress;
        });
    }
    ;
    createProgress(userId, courseId, progress, lastWatchedAt, totalCompletedPercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProgress = yield progressSchema_1.CourseProgress.create({ user: userId, course: courseId, progress, totalCompletedPercent, lastWatchedAt });
            return newProgress;
        });
    }
    ;
    updateProgress(courseProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProgress = yield progressSchema_1.CourseProgress.findOneAndUpdate({ _id: courseProgress._id }, { $set: courseProgress }, { new: true });
            return newProgress;
        });
    }
    ;
}
exports.default = CourseRepository;
