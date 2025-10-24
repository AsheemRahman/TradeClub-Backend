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
const mongoose_1 = require("mongoose");
const reviewSchema_1 = require("../../../model/user/reviewSchema");
const baseRepository_1 = require("../../base/implementation/baseRepository");
class ReviewRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(reviewSchema_1.Review);
    }
    getCourseReviews(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find({ course: courseId })
                .sort({ createdAt: -1 })
                .populate("user", "_id fullName profilePicture")
                .exec();
        });
    }
    addReview(userId, courseId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = new this.model({
                user: new mongoose_1.Types.ObjectId(userId),
                course: new mongoose_1.Types.ObjectId(courseId),
                rating,
                comment,
            });
            return review.save();
        });
    }
    hasUserReviewed(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.model.findOne({
                user: new mongoose_1.Types.ObjectId(userId),
                course: new mongoose_1.Types.ObjectId(courseId),
            });
            return !!existing;
        });
    }
    updateReview(userId, courseId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate({ user: new mongoose_1.Types.ObjectId(userId), course: new mongoose_1.Types.ObjectId(courseId) }, { rating, comment }, { new: true }).exec();
        });
    }
}
exports.default = ReviewRepository;
