import { IReview } from "../../model/user/reviewSchema";

interface IReviewRepository {
    getCourseReviews(courseId: string): Promise<IReview[] | null>
    addReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null>
    updateReview(userId: string, courseId: string, rating: number, comment: string): Promise<IReview | null>
    hasUserReviewed(userId: string, courseId: string): Promise<boolean>
}


export default IReviewRepository;