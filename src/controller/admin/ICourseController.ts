import { Request, Response } from "express"

interface ICourseController {
    addCategory(req: Request, res: Response): Promise<void>;
}

export default ICourseController;