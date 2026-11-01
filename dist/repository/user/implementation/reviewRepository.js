"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema_1 = require("../../../model/user/reviewSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class ReviewRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(reviewSchema_1.Review);
    }
    async getCourseReviews(courseId) {
        return this.model
            .find({ course: courseId })
            .sort({ createdAt: -1 })
            .populate("user", "_id fullName profilePicture")
            .exec();
    }
    async addReview(userId, courseId, rating, comment) {
        const review = new this.model({
            user: new mongoose_1.Types.ObjectId(userId),
            course: new mongoose_1.Types.ObjectId(courseId),
            rating,
            comment,
        });
        return review.save();
    }
    async hasUserReviewed(userId, courseId) {
        const existing = await this.model.findOne({
            user: new mongoose_1.Types.ObjectId(userId),
            course: new mongoose_1.Types.ObjectId(courseId),
        });
        return !!existing;
    }
    async updateReview(userId, courseId, rating, comment) {
        return this.model.findOneAndUpdate({ user: new mongoose_1.Types.ObjectId(userId), course: new mongoose_1.Types.ObjectId(courseId) }, { rating, comment }, { new: true }).exec();
    }
}
exports.default = ReviewRepository;
//# sourceMappingURL=reviewRepository.js.map