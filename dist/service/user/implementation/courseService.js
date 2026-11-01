"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CourseService {
    _courseRepository;
    constructor(courseRepository) {
        this._courseRepository = courseRepository;
    }
    ;
    async getCourse(filters) {
        const res = await this._courseRepository.getCourse(filters);
        return {
            courses: res.courses,
            totalPages: res.totalPages,
            totalCourses: res.totalCourses
        };
    }
    async getCategory() {
        const Category = await this._courseRepository.getCategory();
        return Category;
    }
    async getCourseById(courseId) {
        const Course = await this._courseRepository.getCourseById(courseId);
        return Course;
    }
    async updateCourse(courseId, purchasedUsers) {
        const Courses = await this._courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }
    async getProgress(courseId, userId) {
        const progress = await this._courseRepository.getProgress(courseId, userId);
        return progress;
    }
    async createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent) {
        const newProgress = await this._courseRepository.createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent);
        return newProgress;
    }
    async updateProgress(courseProgress) {
        const progress = await this._courseRepository.updateProgress(courseProgress);
        return progress;
    }
}
exports.default = CourseService;
//# sourceMappingURL=courseService.js.map