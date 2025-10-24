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
class ReviewService {
    constructor(reviewRepository) {
        this._reviewRepository = reviewRepository;
    }
    ;
    getReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._reviewRepository.getCourseReviews(courseId);
        });
    }
    submitReview(userId, courseId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            // const progress = await this.progressRepo.getProgressByUserAndCourse(userId, courseId);
            // if (!progress || progress.totalCompletedPercent < 100) {
            //     throw new Error('Course not completed. You cannot review yet.');
            // }
            // 2. Check if user already reviewed
            const alreadyReviewed = yield this._reviewRepository.hasUserReviewed(userId, courseId);
            if (alreadyReviewed)
                throw new Error('You have already reviewed this course.');
            // 3. Add review
            const review = yield this._reviewRepository.addReview(userId, courseId, rating, comment);
            return review;
        });
    }
    updateReview(userId, courseId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this._reviewRepository.updateReview(userId, courseId, rating, comment);
            return review;
        });
    }
}
exports.default = ReviewService;
