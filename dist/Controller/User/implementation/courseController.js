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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const successMessage_1 = require("../../../constants/successMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class CourseController {
    constructor(courseService) {
        this.getCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { search = '', category, minPrice = 0, maxPrice = 10000, sort = 'newest', page = 1, limit = 4 } = req.query;
            const result = yield this._courseService.getCourse({
                search: search,
                category: category,
                minPrice: Number(minPrice),
                maxPrice: Number(maxPrice),
                sort: sort,
                page: Number(page),
                limit: Number(limit),
            });
            res.status(statusCode_1.STATUS_CODES.OK).json(Object.assign({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH }, result));
        }));
        this.getCoursebyId = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this.getCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const categories = yield this._courseService.getCategory();
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories });
        }));
        this.checkEnrolled = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = req.userId;
            const courseId = req.params.id;
            if (!userId || !courseId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, });
                return;
            }
            const course = yield this._courseService.getCourseById(courseId);
            if (!course) {
                res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, });
                return;
            }
            const isEnrolled = (_a = course.purchasedUsers) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, isEnrolled: Boolean(isEnrolled), });
        }));
        this.getProgress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { courseId } = req.params;
            if (!userId || !courseId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User ID or Course ID is missing", });
                return;
            }
            const progress = yield this._courseService.getProgress(courseId, userId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "progress Fetched Successfully", progress });
        }));
        this.updateProgress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const { courseId } = req.params;
            const { contentId, watchedDuration, isCompleted } = req.body;
            if (!userId || !contentId || watchedDuration === undefined || isCompleted === undefined) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
                return;
            }
            // Find existing progress for the user and course
            let courseProgress = yield this._courseService.getProgress(courseId, userId);
            const currentDate = new Date();
            if (!courseProgress) {
                const newProgress = yield this._courseService.createProgress(userId, courseId, [{
                        contentId,
                        watchedDuration,
                        isCompleted,
                        lastWatchedAt: currentDate
                    }], currentDate, isCompleted ? 100 : 0);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ status: true, message: "Progress created successfully", progress: newProgress });
                return;
            }
            courseProgress.lastWatchedAt = currentDate;
            const existingIndex = courseProgress.progress.findIndex(p => p.contentId.equals(contentId));
            if (existingIndex !== -1) {
                // Update existing video progress
                courseProgress.progress[existingIndex].watchedDuration = watchedDuration;
                courseProgress.progress[existingIndex].isCompleted = isCompleted;
                courseProgress.progress[existingIndex].lastWatchedAt = currentDate;
            }
            else {
                // Add new video progress
                courseProgress.progress.push({
                    contentId,
                    watchedDuration,
                    isCompleted,
                    lastWatchedAt: currentDate
                });
            }
            // Recalculate total completed percent
            const totalVideos = courseProgress.progress.length;
            const completedVideos = courseProgress.progress.filter(p => p.isCompleted).length;
            courseProgress.totalCompletedPercent = Math.round((completedVideos / totalVideos) * 100);
            // Set completedAt if all videos are completed
            courseProgress.completedAt = (completedVideos === totalVideos && totalVideos > 0) ? currentDate : undefined;
            const updatedProgress = yield this._courseService.updateProgress(courseProgress);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Progress updated successfully", progress: updatedProgress });
        }));
        this._courseService = courseService;
    }
}
;
exports.default = CourseController;
