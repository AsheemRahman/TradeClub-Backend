import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/admin/ICourseService";
import { ICourse } from "../../../model/admin/courseSchema";
import { asyncHandler } from "../../../utils/asyncHandler";


class CourseController implements ICourseController {

    private _courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this._courseService = courseService;
    }

    //----------------------------- Category -----------------------------

    getCategory = asyncHandler(async (req: Request, res: Response) => {
        const categories = await this._courseService.getCategory();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories })
    });

    addCategory = asyncHandler(async (req: Request, res: Response) => {
        const { categoryName } = req.body;
        if (!categoryName) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const newCategory = await this._courseService.addCategory(categoryName);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Category Created Successfully", newCategory })
    });

    deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const newCategory = await this._courseService.deleteCategory(id);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "Category Deleted Successfully", newCategory })
    });

    editCategory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { categoryName } = req.body;
        if (!id || !categoryName) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const newCategory = await this._courseService.editCategory(id, categoryName);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Category Edited Successfully", newCategory })
    });

    categoryStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || status === undefined) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
            return;
        }
        const checkCategory = await this._courseService.getCategoryById(id)
        if (!checkCategory) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.USER_NOT_FOUND })
            return
        }
        await this._courseService.categoryStatus(id, status)
        res.status(STATUS_CODES.OK).json({ success: true, message: "Category status change successfully", });
    });

    //----------------------------- Course -----------------------------

    getCourse = asyncHandler(async (req: Request, res: Response) => {
        const courses = await this._courseService.getCourse();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Courses Fetched Successfully", courses })
    });

    getCourseById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const course = await this._courseService.getCourseById(id)
        if (!course) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        res.status(STATUS_CODES.OK).json({ status: true, message: "Course Fetched Successfully", course })
    });

    addCourse = asyncHandler(async (req: Request, res: Response) => {
        const { title, description, price, imageUrl, category, content, isPublished } = req.body;
        if (!title || !description || !price || !imageUrl || !category || !content) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const course = await this._courseService.addCourse({ title, description, price, imageUrl, category, content, isPublished } as ICourse);
        res.status(STATUS_CODES.OK).json({ status: true, message: "course created successfully", course });
    });

    editCourse = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const { title, description, price, imageUrl, category, content, isPublished } = req.body;
        if (!title || !description || !price || !imageUrl || !category || !content) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }
        const checkCourse = await this._courseService.getCourseById(id)
        if (!checkCourse) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const course = await this._courseService.editCourse(id, { title, description, price, imageUrl, category, content, isPublished } as ICourse);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Course updated successfully", course });
    });

    deleteCourse = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        const checkCourse = await this._courseService.getCourseById(id)
        if (!checkCourse) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        const course = await this._courseService.deleteCourse(id);
        res.status(STATUS_CODES.CREATED).json({ status: true, message: "course Deleted Successfully", course })
    });

    togglePublish = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR })
            return;
        }
        const checkCourse = await this._courseService.getCourseById(id)
        if (!checkCourse) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return
        }
        await this._courseService.togglePublish(id, !checkCourse.isPublished)
        res.status(STATUS_CODES.OK).json({ status: true, message: "Course status change successfully", });
    });
}

export default CourseController;