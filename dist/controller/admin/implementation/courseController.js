"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage_1 = require("../../../constants/errorMessage");
const successMessage_1 = require("../../../constants/successMessage");
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class CourseController {
    _courseService;
    constructor(courseService) {
        this._courseService = courseService;
    }
    //----------------------------- Category -----------------------------
    getCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const categories = await this._courseService.getCategory();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, categories });
    });
    addCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { categoryName } = req.body;
        if (!categoryName) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const newCategory = await this._courseService.addCategory(categoryName);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.CATEGORY_FETCH, newCategory });
    });
    deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const newCategory = await this._courseService.deleteCategory(id);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Category Deleted Successfully", newCategory });
    });
    editCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { categoryName } = req.body;
        if (!id || !categoryName) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const newCategory = await this._courseService.editCategory(id, categoryName);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Category Edited Successfully", newCategory });
    });
    categoryStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || status === undefined) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            return;
        }
        const checkCategory = await this._courseService.getCategoryById(id);
        if (!checkCategory) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        await this._courseService.categoryStatus(id, status);
        res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Category status change successfully", });
    });
    //----------------------------- Course -----------------------------
    getCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courses = await this._courseService.getCourse();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, courses });
    });
    getCourseById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const course = await this._courseService.getCourseById(id);
        if (!course) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, course });
    });
    addCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { title, description, price, imageUrl, category, content, isPublished } = req.body;
        if (!title || !description || !price || !imageUrl || !category || !content) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const course = await this._courseService.addCourse({ title, description, price, imageUrl, category, content, isPublished });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "course created successfully", course });
    });
    editCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
        const checkCourse = await this._courseService.getCourseById(id);
        if (!checkCourse) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const course = await this._courseService.editCourse(id, { title, description, price, imageUrl, category, content, isPublished });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Course updated successfully", course });
    });
    deleteCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const checkCourse = await this._courseService.getCourseById(id);
        if (!checkCourse) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        const course = await this._courseService.deleteCourse(id);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "course Deleted Successfully", course });
    });
    togglePublish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
            return;
        }
        const checkCourse = await this._courseService.getCourseById(id);
        if (!checkCourse) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND });
            return;
        }
        await this._courseService.togglePublish(id, !checkCourse.isPublished);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Course status change successfully", });
    });
}
exports.default = CourseController;
//# sourceMappingURL=courseController.js.map