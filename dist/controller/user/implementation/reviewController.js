"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class ReviewController {
    _reviewService;
    constructor(reviewService) {
        this._reviewService = reviewService;
    }
    getCourseReviews = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { courseId } = req.params;
        const reviews = await this._reviewService.getReviews(courseId);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, reviews });
    });
    submitReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        const review = await this._reviewService.submitReview(userId, courseId, rating, comment);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Review created succesfully", review });
    });
    updateReview = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
            return;
        }
        const review = await this._reviewService.updateReview(userId, courseId, rating, comment);
        res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Review updated succesfully", review });
    });
}
exports.default = ReviewController;
//# sourceMappingURL=reviewController.js.map