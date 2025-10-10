import { NextFunction, Request, Response } from "express";


type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface ICourseController {
    getCourse: ControllerMethod;
    getCoursebyId: ControllerMethod;
    getCategory: ControllerMethod;
    checkEnrolled: ControllerMethod;
    getProgress: ControllerMethod;
    updateProgress: ControllerMethod;
}


export default ICourseController;