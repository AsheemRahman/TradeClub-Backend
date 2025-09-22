import { Types } from 'mongoose';
import { IReview, Review } from '../../../model/user/reviewSchema';
import IReviewRepository from '../IReviewRepository';

class ReviewRepository implements IReviewRepository {

    async getCourseReviews(courseId: string): Promise<IReview[]> {
        return Review.find({ course: courseId }).sort({ createdAt: -1 }).populate('user', 'fullName');
    }

    async addReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview> {
        const review = new Review({ user: new Types.ObjectId(userId), course: new Types.ObjectId(courseId), rating, comment });
        return review.save();
    }

    async hasUserReviewed(userId: string, courseId: string): Promise<boolean> {
        const existing = await Review.findOne({ user: userId, course: courseId });
        return !!existing;
    }
}

export default ReviewRepository;
