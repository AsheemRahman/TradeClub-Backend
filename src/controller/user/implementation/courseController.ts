import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message"

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/user/ICourseService";


class CourseController implements ICourseController {
    private courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this.courseService = courseService;
    }

    async getCourse(req: Request, res: Response): Promise<void> {
        console.log("inside")
        try {
            const courses = await this.courseService.getCourse();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Courses Fetched Successfully", courses })
        } catch (error) {
            console.error("Failed to fetch Courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Courses", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.courseService.getCategory();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories })
        } catch (error) {
            console.error("Failed to fetch category", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch category", error: error instanceof Error ? error.message : String(error), });
        }
    };
}




export default CourseController;