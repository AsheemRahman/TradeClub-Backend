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
const errorMessage_1 = require("../../../constants/errorMessage");
const successMessage_1 = require("../../../constants/successMessage");
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class CourseController {
    constructor(courseService) {
        //----------------------------- Category -----------------------------
        this.getCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._courseService.getCategory();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, categories });
        }));
        this.addCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { categoryName } = req.body;
            if (!categoryName) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const newCategory = yield this._courseService.addCategory(categoryName);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.CATEGORY_FETCH, newCategory });
        }));
        this.deleteCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const newCategory = yield this._courseService.deleteCategory(id);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Category Deleted Successfully", newCategory });
        }));
        this.editCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { categoryName } = req.body;
            if (!id || !categoryName) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const newCategory = yield this._courseService.editCategory(id, categoryName);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Category Edited Successfully", newCategory });
        }));
        this.categoryStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            if (!id || status === undefined) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
                return;
            }
            const checkCategory = yield this._courseService.getCategoryById(id);
            if (!checkCategory) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            yield this._courseService.categoryStatus(id, status);
            res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Category status change successfully", });
        }));
        //----------------------------- Course -----------------------------
        this.getCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const courses = yield this._courseService.getCourse();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, courses });
        }));
        this.getCourseById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const course = yield this._courseService.getCourseById(id);
            if (!course) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, course });
        }));
        this.addCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { title, description, price, imageUrl, category, content, isPublished } = req.body;
            if (!title || !description || !price || !imageUrl || !category || !content) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const course = yield this._courseService.addCourse({ title, description, price, imageUrl, category, content, isPublished });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "course created successfully", course });
        }));
        this.editCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const { title, description, price, imageUrl, category, content, isPublished } = req.body;
            if (!title || !description || !price || !imageUrl || !category || !content) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            const checkCourse = yield this._courseService.getCourseById(id);
            if (!checkCourse) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const course = yield this._courseService.editCourse(id, { title, description, price, imageUrl, category, content, isPublished });
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Course updated successfully", course });
        }));
        this.deleteCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const checkCourse = yield this._courseService.getCourseById(id);
            if (!checkCourse) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            const course = yield this._courseService.deleteCourse(id);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "course Deleted Successfully", course });
        }));
        this.togglePublish = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
                return;
            }
            const checkCourse = yield this._courseService.getCourseById(id);
            if (!checkCourse) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
                return;
            }
            yield this._courseService.togglePublish(id, !checkCourse.isPublished);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Course status change successfully", });
        }));
        this._courseService = courseService;
    }
}
exports.default = CourseController;
