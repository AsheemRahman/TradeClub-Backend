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
const baseRepository_1 = require("../../base/implementation/baseRepository");
class CourseRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(courseSchema_1.default);
        this.categoryModel = categorySchema_1.default;
    }
    //------------------------ Category ------------------------
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryModel.find().sort({ createdAt: -1 });
            return category;
        });
    }
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryModel.findById(categoryId);
            return category;
        });
    }
    addCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = yield this.categoryModel.create({ categoryName });
            return newCategory;
        });
    }
    editCategory(categoryId, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = yield this.categoryModel.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
            return newCategory;
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = yield this.categoryModel.findByIdAndDelete(categoryId);
            return newCategory;
        });
    }
    categoryStatus(categoryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryModel.findByIdAndUpdate(categoryId, { isActive: status }, { new: true });
            return category;
        });
    }
    //------------------------- Course -------------------------
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findById(courseId);
        });
    }
    getCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield this.model.find().sort({ createdAt: -1 });
            return courses;
        });
    }
    addCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(courseData);
        });
    }
    editCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCourses = yield this.findByIdAndUpdate(courseId, Object.assign({}, courseData));
            return newCourses;
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.delete(courseId);
            return course;
        });
    }
    togglePublish(courseId, isPublished) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.findByIdAndUpdate(courseId, { isPublished });
            return course;
        });
    }
}
exports.default = CourseRepository;
