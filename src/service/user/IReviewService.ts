import { IReview } from "../../model/user/reviewSchema";

interface IReviewService {
    getReviews(courseId: string): Promise<IReview[] | null>;
    submitReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null>;
    updateReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null>;
}

export default IReviewService;