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
Object.defineProperty(exports, "__esModule", { value: true });
class CourseService {
    constructor(courseRepository) {
        this._courseRepository = courseRepository;
    }
    ;
    getCourse(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._courseRepository.getCourse(filters);
            return {
                courses: res.courses,
                totalPages: res.totalPages,
                totalCourses: res.totalCourses
            };
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.getCategory();
            return Category;
        });
    }
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Course = yield this._courseRepository.getCourseById(courseId);
            return Course;
        });
    }
    updateCourse(courseId, purchasedUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.updateCourse(courseId, purchasedUsers);
            return Courses;
        });
    }
    getProgress(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield this._courseRepository.getProgress(courseId, userId);
            return progress;
        });
    }
    createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProgress = yield this._courseRepository.createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent);
            return newProgress;
        });
    }
    updateProgress(courseProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield this._courseRepository.updateProgress(courseProgress);
            return progress;
        });
    }
}
exports.default = CourseService;
