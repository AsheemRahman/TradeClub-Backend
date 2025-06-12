import { Request, Response } from "express"

interface ICourseController {
    getCategory(req: Request, res: Response): Promise<void>;
    addCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
    editCategory(req: Request, res: Response): Promise<void>;
}

export default ICourseController;