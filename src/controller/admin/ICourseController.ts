import { NextFunction, Request, Response } from "express"

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;


interface ICourseController {

    //----------------------- Category -----------------------

    getCategory: ControllerMethod;
    addCategory: ControllerMethod;
    deleteCategory: ControllerMethod;
    editCategory: ControllerMethod;
    categoryStatus: ControllerMethod;

    //------------------------ Course ------------------------

    getCourse: ControllerMethod;
    getCourseById: ControllerMethod;
    addCourse: ControllerMethod;
    editCourse: ControllerMethod;
    deleteCourse: ControllerMethod;
    togglePublish: ControllerMethod;
}

export default ICourseController;