
import { IReview } from "../../../model/user/reviewSchema";
import IReviewRepository from "../../../repository/user/IReviewRepository";
import IReviewService from "../IReviewService";



class ReviewService implements IReviewService {
    private _reviewRepository: IReviewRepository;

    constructor(reviewRepository: IReviewRepository) {
        this._reviewRepository = reviewRepository;
    };


    async getReviews(courseId: string): Promise<IReview[] | null> {
        return this._reviewRepository.getCourseReviews(courseId);
    }

    async submitReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null> {
        // const progress = await this.progressRepo.getProgressByUserAndCourse(userId, courseId);
        // if (!progress || progress.totalCompletedPercent < 100) {
        //     throw new Error('Course not completed. You cannot review yet.');
        // }

        // 2. Check if user already reviewed
        const alreadyReviewed = await this._reviewRepository.hasUserReviewed(userId, courseId);
        if (alreadyReviewed) throw new Error('You have already reviewed this course.');

        // 3. Add review
        const review = await this._reviewRepository.addReview(userId, courseId, rating, comment);
        return review;
    }
}


export default ReviewService;