import { Request, Response } from "express";
import IReviewController from "../IReviewController";
import IReviewService from "../../../service/user/IReviewService";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage"
import { asyncHandler } from "../../../utils/asyncHandler";


class ReviewController implements IReviewController {
    private _reviewService: IReviewService;
    constructor(reviewService: IReviewService) {
        this._reviewService = reviewService;
    }

    getCourseReviews = asyncHandler(async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const reviews = await this._reviewService.getReviews(courseId);
        res.status(STATUS_CODES.OK).json({ status: true, reviews });
    });

    submitReview = asyncHandler(async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const review = await this._reviewService.submitReview(userId, courseId, rating, comment);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Review created succesfully", review });
    });

    updateReview = asyncHandler(async (req: Request, res: Response) => {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;
        if (!userId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        const review = await this._reviewService.updateReview(userId, courseId, rating, comment);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Review updated succesfully", review });
    });
}

export default ReviewController;