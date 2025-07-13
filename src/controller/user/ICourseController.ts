import { Request, Response } from "express";


interface ICourseController {
    getCourse(req: Request, res: Response): Promise<void>;
    getCoursebyId(req: Request, res: Response): Promise<void>;
    getCategory(req: Request, res: Response): Promise<void>;
    checkEnrolled(req: Request, res: Response): Promise<void>;
}

export default ICourseController;