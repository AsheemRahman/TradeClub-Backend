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
    //------------------------ Category ------------------------
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.getCategory();
            return Category;
        });
    }
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.getCategoryById(categoryId);
            return Category;
        });
    }
    addCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.addCategory(categoryName);
            return Category;
        });
    }
    editCategory(categoryId, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.editCategory(categoryId, categoryName);
            return Category;
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Category = yield this._courseRepository.deleteCategory(categoryId);
            return Category;
        });
    }
    categoryStatus(categoryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this._courseRepository.categoryStatus(categoryId, status);
            return category;
        });
    }
    //------------------------- Course -------------------------
    getCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Course = yield this._courseRepository.getCourseById(courseId);
            return Course;
        });
    }
    getCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.getCourse();
            return Courses;
        });
    }
    addCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.addCourse(courseData);
            return Courses;
        });
    }
    editCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const Courses = yield this._courseRepository.editCourse(courseId, courseData);
            return Courses;
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.deleteCourse(courseId);
            return course;
        });
    }
    togglePublish(courseId, isPublished) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this._courseRepository.togglePublish(courseId, isPublished);
            return course;
        });
    }
}
exports.default = CourseService;
