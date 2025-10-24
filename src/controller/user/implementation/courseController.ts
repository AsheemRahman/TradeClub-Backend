import { Request, Response } from "express";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage"
import { SUCCESS_MESSAGES } from "../../../constants/successMessage"

import ICourseController from "../ICourseController";
import ICourseService from "../../../service/user/ICourseService";
import { asyncHandler } from "../../../utils/asyncHandler";


class CourseController implements ICourseController {
    private _courseService: ICourseService;

    constructor(courseService: ICourseService) {
        this._courseService = courseService;
    }

    getCourse = asyncHandler(async (req: Request, res: Response) => {
        const { search = '', category, minPrice = 0, maxPrice = 10000, sort = 'newest', page = 1, limit = 4 } = req.query;
        const result = await this._courseService.getCourse({
            search: search as string,
            category: category as string,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            sort: sort as string,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.COURSE_FETCH, ...result });
    });

    getCoursebyId = asyncHandler(async (req: Request, res: Response) => {
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
        res.status(STATUS_CODES.OK).json({ status: true, message: SUCCESS_MESSAGES.COURSE_FETCH, course })
    });

    getCategory = asyncHandler(async (req: Request, res: Response) => {
        const categories = await this._courseService.getCategory();
        res.status(STATUS_CODES.OK).json({ status: true, message: "Category Fetched Successfully", categories })
    });

    checkEnrolled = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        const courseId = req.params.id;
        if (!userId || !courseId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND, });
            return;
        }
        const course = await this._courseService.getCourseById(courseId);
        if (!course) {
            res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND, });
            return;
        }
        const isEnrolled = course.purchasedUsers?.some((id) => id.toString() === userId);
        res.status(STATUS_CODES.OK).json({ status: true, isEnrolled: Boolean(isEnrolled), });
    });

    getProgress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId
        const { courseId } = req.params
        if (!userId || !courseId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "User ID or Course ID is missing", });
            return;
        }
        const progress = await this._courseService.getProgress(courseId, userId);
        res.status(STATUS_CODES.OK).json({ status: true, message: "progress Fetched Successfully", progress })
    });

    updateProgress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.userId;
        const { courseId } = req.params;
        const { contentId, watchedDuration, isCompleted } = req.body;
        if (!userId || !contentId || watchedDuration === undefined || isCompleted === undefined) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
            return;
        }

        // Find existing progress for the user and course
        let courseProgress = await this._courseService.getProgress(courseId, userId);
        const currentDate = new Date();
        if (!courseProgress) {
            const newProgress = await this._courseService.createProgress(userId, courseId, [{
                contentId,
                watchedDuration,
                isCompleted,
                lastWatchedAt: currentDate
            }], currentDate, isCompleted ? 100 : 0)
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Progress created successfully", progress: newProgress });
            return;
        }
        courseProgress.lastWatchedAt = currentDate;
        const existingIndex = courseProgress.progress.findIndex(p => p.contentId.equals(contentId));
        if (existingIndex !== -1) {
            // Update existing video progress
            courseProgress.progress[existingIndex].watchedDuration = watchedDuration;
            courseProgress.progress[existingIndex].isCompleted = isCompleted;
            courseProgress.progress[existingIndex].lastWatchedAt = currentDate;
        } else {
            // Add new video progress
            courseProgress.progress.push({
                contentId,
                watchedDuration,
                isCompleted,
                lastWatchedAt: currentDate
            });
        }
        // Recalculate total completed percent
        const totalVideos = courseProgress.progress.length;
        const completedVideos = courseProgress.progress.filter(p => p.isCompleted).length;
        courseProgress.totalCompletedPercent = Math.round((completedVideos / totalVideos) * 100);
        // Set completedAt if all videos are completed
        courseProgress.completedAt = (completedVideos === totalVideos && totalVideos > 0) ? currentDate : undefined;
        const updatedProgress = await this._courseService.updateProgress(courseProgress);
        res.status(STATUS_CODES.OK).json({ status: true, message: "Progress updated successfully", progress: updatedProgress });
    });
};




export default CourseController;