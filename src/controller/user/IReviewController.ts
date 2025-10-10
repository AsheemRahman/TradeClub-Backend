import { NextFunction, Request, Response } from "express";


type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface IReviewController {
    getCourseReviews: ControllerMethod;
    submitReview: ControllerMethod;
    updateReview: ControllerMethod;
}


export default IReviewController;