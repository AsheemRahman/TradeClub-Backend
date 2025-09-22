import { Request, Response } from "express";


interface IReviewController {
    getCourseReviews(req: Request, res: Response): Promise<void>;
    submitReview(req: Request, res: Response): Promise<void>;
    updateReview(req: Request, res: Response): Promise<void>;
}

export default IReviewController;