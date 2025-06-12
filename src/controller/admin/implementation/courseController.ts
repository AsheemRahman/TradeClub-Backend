import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/admin/ICourseService";


class CourseController implements ICourseController {

    private courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this.courseService = courseService;
    }

    async addCategory(req: Request, res: Response): Promise<void> {
        const { categoryName } = req.body;
        if (!categoryName) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const newCategory = await this.courseService.addCategory(categoryName);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Category Created Successfully", newCategory })
        } catch (error) {
            console.error("Category Creation failed", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Category Creation failed", error: error instanceof Error ? error.message : String(error), });
        }
    };
}

export default CourseController;