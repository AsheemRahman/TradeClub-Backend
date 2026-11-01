"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categorySchema_1 = __importDefault(require("../../../model/admin/categorySchema"));
const courseSchema_1 = __importDefault(require("../../../model/admin/courseSchema"));
const baseRepository_1 = require("../../base/implementation/baseRepository");
class CourseRepository extends baseRepository_1.BaseRepository {
    categoryModel = categorySchema_1.default;
    constructor() {
        super(courseSchema_1.default);
    }
    //------------------------ Category ------------------------
    async getCategory() {
        const category = await this.categoryModel.find().sort({ createdAt: -1 });
        return category;
    }
    async getCategoryById(categoryId) {
        const category = await this.categoryModel.findById(categoryId);
        return category;
    }
    async addCategory(categoryName) {
        const newCategory = await this.categoryModel.create({ categoryName });
        return newCategory;
    }
    async editCategory(categoryId, categoryName) {
        const newCategory = await this.categoryModel.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
        return newCategory;
    }
    async deleteCategory(categoryId) {
        const newCategory = await this.categoryModel.findByIdAndDelete(categoryId);
        return newCategory;
    }
    async categoryStatus(categoryId, status) {
        const category = await this.categoryModel.findByIdAndUpdate(categoryId, { isActive: status }, { new: true });
        return category;
    }
    //------------------------- Course -------------------------
    async getCourseById(courseId) {
        return this.findById(courseId);
    }
    async getCourse() {
        const courses = await this.model.find().sort({ createdAt: -1 });
        return courses;
    }
    async addCourse(courseData) {
        return this.create(courseData);
    }
    async editCourse(courseId, courseData) {
        const newCourses = await this.findByIdAndUpdate(courseId, { ...courseData });
        return newCourses;
    }
    async deleteCourse(courseId) {
        const course = await this.delete(courseId);
        return course;
    }
    async togglePublish(courseId, isPublished) {
        const course = await this.findByIdAndUpdate(courseId, { isPublished });
        return course;
    }
}
exports.default = CourseRepository;
//# sourceMappingURL=courseRepository.js.map