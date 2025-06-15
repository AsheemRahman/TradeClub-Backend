import { Request, Response } from "express"

interface ICourseController {

    //----------------------- Category -----------------------

    getCategory(req: Request, res: Response): Promise<void>;
    addCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
    editCategory(req: Request, res: Response): Promise<void>;
    categoryStatus(req: Request, res: Response): Promise<void>;

    //------------------------ Course ------------------------

    getCourse(req: Request, res: Response): Promise<void>;
    addCourse(req: Request, res: Response): Promise<void>;
    editCourse(req: Request, res: Response): Promise<void>;
    deleteCourse(req: Request, res: Response): Promise<void>;
    togglePublish(req: Request, res: Response): Promise<void>;
}

export default ICourseController;