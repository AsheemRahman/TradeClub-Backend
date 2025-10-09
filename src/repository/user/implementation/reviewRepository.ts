import { Types } from "mongoose";
import { IReview, Review } from "../../../model/user/reviewSchema";
import IReviewRepository from "../IReviewRepository";
import { BaseRepository } from "../../base/implementation/BaseRepository";

class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(Review);
    }

    async getCourseReviews(courseId: string): Promise<IReview[]> {
        return this.model
            .find({ course: courseId })
            .sort({ createdAt: -1 })
            .populate("user", "_id fullName profilePicture")
            .exec();
    }

    async addReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview> {
        const review = new this.model({
            user: new Types.ObjectId(userId),
            course: new Types.ObjectId(courseId),
            rating,
            comment,
        });
        return review.save();
    }

    async hasUserReviewed(userId: string, courseId: string): Promise<boolean> {
        const existing = await this.model.findOne({
            user: new Types.ObjectId(userId),
            course: new Types.ObjectId(courseId),
        });
        return !!existing;
    }

    async updateReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null> {
        return this.model.findOneAndUpdate(
            { user: new Types.ObjectId(userId), course: new Types.ObjectId(courseId) },
            { rating, comment },
            { new: true }
        ).exec();
    }
}

export default ReviewRepository;
