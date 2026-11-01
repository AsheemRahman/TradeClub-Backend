"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const successMessage_1 = require("../../../constants/successMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class CourseController {
    _courseService;
    constructor(courseService) {
        this._courseService = courseService;
    }
    getCourse = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { search = '', category, minPrice = 0, maxPrice = 10000, sort = 'newest', page = 1, limit = 4 } = req.query;
        const result = await this._courseService.getCourse({
            search: search,
            category: category,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            sort: sort,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: successMessage_1.SUCCESS_MESSAGES.COURSE_FETCH, ...result });
    });
    getCoursebyId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    getCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const categories = await this._courseService.getCategory();
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories });
    });
    checkEnrolled = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const courseId = req.params.id;
        if (!userId || !courseId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, });
            return;
        }
        const course = await this._courseService.getCourseById(courseId);
        if (!course) {
            res.status(statusCode_1.STATUS_CODES.NOT_FOUND).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.NOT_FOUND, });
            return;
        }
        const isEnrolled = course.purchasedUsers?.some((id) => id.toString() === userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, isEnrolled: Boolean(isEnrolled), });
    });
    getProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { courseId } = req.params;
        if (!userId || !courseId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User ID or Course ID is missing", });
            return;
        }
        const progress = await this._courseService.getProgress(courseId, userId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "progress Fetched Successfully", progress });
    });
    updateProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.userId;
        const { courseId } = req.params;
        const { contentId, watchedDuration, isCompleted } = req.body;
        if (!userId || !contentId || watchedDuration === undefined || isCompleted === undefined) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        // Find existing progress for the user and course
        let courseProgress = await this._courseService.getProgress(courseId, userId);
        const currentDate = new Date();
        if (!courseProgress) {
            const newProgress = await this._courseService.createProgress(userId, courseId, [{
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
        const updatedProgress = await this._courseService.updateProgress(courseProgress);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Progress updated successfully", progress: updatedProgress });
    });
}
;
exports.default = CourseController;
//# sourceMappingURL=courseController.js.map