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

    //----------------------------- Category -----------------------------

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.courseService.getCategory();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories })
        } catch (error) {
            console.error("Failed to fetch category", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch category", error: error instanceof Error ? error.message : String(error), });
        }
    };

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

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const newCategory = await this.courseService.deleteCategory(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Category Deleted Successfully", newCategory })
        } catch (error) {
            console.error("Failed to delete category", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to delete category", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async editCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { categoryName } = req.body;
        if (!id || !categoryName) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const newCategory = await this.courseService.editCategory(id, categoryName);
            res.status(STATUS_CODES.OK).json({ status: true, message: "Category Edited Successfully", newCategory })
        } catch (error) {
            console.error("Failed to Edited category", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to Edited category", error: error instanceof Error ? error.message : String(error), });
        }
    };

    //----------------------------- Course -----------------------------

    async getCourse(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.courseService.getCourse();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Courses Fetched Successfully", categories })
        } catch (error) {
            console.error("Failed to fetch Courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Courses", error: error instanceof Error ? error.message : String(error), });
        }
    };

    async deleteCourse(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const course = await this.courseService.deleteCourse(id);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "course Deleted Successfully", course })
        } catch (error) {
            console.error("Failed to delete course", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to delete course", error: error instanceof Error ? error.message : String(error), });
        }
    };
}

export default CourseController;