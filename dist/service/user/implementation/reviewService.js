"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReviewService {
    _reviewRepository;
    constructor(reviewRepository) {
        this._reviewRepository = reviewRepository;
    }
    ;
    async getReviews(courseId) {
        return this._reviewRepository.getCourseReviews(courseId);
    }
    async submitReview(userId, courseId, rating, comment) {
        // const progress = await this.progressRepo.getProgressByUserAndCourse(userId, courseId);
        // if (!progress || progress.totalCompletedPercent < 100) {
        //     throw new Error('Course not completed. You cannot review yet.');
        // }
        // 2. Check if user already reviewed
        const alreadyReviewed = await this._reviewRepository.hasUserReviewed(userId, courseId);
        if (alreadyReviewed)
            throw new Error('You have already reviewed this course.');
        // 3. Add review
        const review = await this._reviewRepository.addReview(userId, courseId, rating, comment);
        return review;
    }
    async updateReview(userId, courseId, rating, comment) {
        const review = await this._reviewRepository.updateReview(userId, courseId, rating, comment);
        return review;
    }
}
exports.default = ReviewService;
//# sourceMappingURL=reviewService.js.map