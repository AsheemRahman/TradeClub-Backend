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
const asyncHandler_1 = require("../../../utils/asyncHandler");
class ReviewController {
    constructor(reviewService) {
        this.getCourseReviews = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const reviews = yield this._reviewService.getReviews(courseId);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, reviews });
        }));
        this.submitReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const review = yield this._reviewService.submitReview(userId, courseId, rating, comment);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Review created succesfully", review });
        }));
        this.updateReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(statusCode_1.STATUS_CODES.BAD_REQUEST).json({ status: false, message: errorMessage_1.ERROR_MESSAGES.USER_NOT_FOUND });
                return;
            }
            const review = yield this._reviewService.updateReview(userId, courseId, rating, comment);
            res.status(statusCode_1.STATUS_CODES.OK).json({ status: true, message: "Review updated succesfully", review });
        }));
        this._reviewService = reviewService;
    }
}
exports.default = ReviewController;
