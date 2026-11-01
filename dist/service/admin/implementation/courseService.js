"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CourseService {
    _courseRepository;
    constructor(courseRepository) {
        this._courseRepository = courseRepository;
    }
    //------------------------ Category ------------------------
    async getCategory() {
        const Category = await this._courseRepository.getCategory();
        return Category;
    }
    async getCategoryById(categoryId) {
        const Category = await this._courseRepository.getCategoryById(categoryId);
        return Category;
    }
    async addCategory(categoryName) {
        const Category = await this._courseRepository.addCategory(categoryName);
        return Category;
    }
    async editCategory(categoryId, categoryName) {
        const Category = await this._courseRepository.editCategory(categoryId, categoryName);
        return Category;
    }
    async deleteCategory(categoryId) {
        const Category = await this._courseRepository.deleteCategory(categoryId);
        return Category;
    }
    async categoryStatus(categoryId, status) {
        const category = await this._courseRepository.categoryStatus(categoryId, status);
        return category;
    }
    //------------------------- Course -------------------------
    async getCourseById(courseId) {
        const Course = await this._courseRepository.getCourseById(courseId);
        return Course;
    }
    async getCourse() {
        const Courses = await this._courseRepository.getCourse();
        return Courses;
    }
    async addCourse(courseData) {
        const Courses = await this._courseRepository.addCourse(courseData);
        return Courses;
    }
    async editCourse(courseId, courseData) {
        const Courses = await this._courseRepository.editCourse(courseId, courseData);
        return Courses;
    }
    async deleteCourse(courseId) {
        const course = await this._courseRepository.deleteCourse(courseId);
        return course;
    }
    async togglePublish(courseId, isPublished) {
        const course = await this._courseRepository.togglePublish(courseId, isPublished);
        return course;
    }
}
exports.default = CourseService;
//# sourceMappingURL=courseService.js.map