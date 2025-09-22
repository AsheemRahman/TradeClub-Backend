import { Request, Response } from "express";
import IReviewController from "../IReviewController";
import IReviewService from "../../../service/user/IReviewService";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"


class ReviewController implements IReviewController {
    private _reviewService: IReviewService;
    constructor(reviewService: IReviewService) {
        this._reviewService = reviewService;
    }

    async getCourseReviews(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const reviews = await this._reviewService.getReviews(courseId);
            res.status(STATUS_CODES.OK).json({ status: true, reviews });
        } catch (error) {
            console.error("Error in get course review", error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async submitReview(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const review = await this._reviewService.submitReview(userId, courseId, rating, comment);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Review created succesfully", review });
        } catch (error) {
            console.error("error while create review", error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async updateReview(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const userId = req.userId;
            if (!userId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
                return
            }
            const review = await this._reviewService.updateReview(userId, courseId, rating, comment);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Review updated succesfully", review });
        } catch (error) {
            console.error("error while update review", error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }
}

export default ReviewController;