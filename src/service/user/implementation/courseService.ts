import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/user/ICourseRepository";

import { ICourse } from "../../../model/admin/courseSchema";
import { ICategory } from "../../../model/admin/categorySchema";
import { ICourseProgress, IVideoProgress } from "../../../model/user/progressSchema";


class CourseService implements ICourseService {
    private _courseRepository: ICourseRepository;

    constructor(courseRepository: ICourseRepository) {
        this._courseRepository = courseRepository;
    };

    async getCourse(filters: { search: string; category?: string; minPrice: number; maxPrice: number; sort: string; page: number; limit: number; }): Promise<{ courses: ICourse[]; totalPages: number; totalCourses: number }> {
        const res = await this._courseRepository.getCourse(filters);
        return {
            courses: res.courses,
            totalPages: res.totalPages,
            totalCourses: res.totalCourses
        };
    }

    async getCategory(): Promise<ICategory[] | null> {
        const Category = await this._courseRepository.getCategory();
        return Category;
    }

    async getCourseById(courseId: string): Promise<ICourse | null> {
        const Course = await this._courseRepository.getCourseById(courseId);
        return Course;
    }

    async updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null> {
        const Courses = await this._courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }

    async getProgress(courseId: string, userId: string): Promise<ICourseProgress | null> {
        const progress = await this._courseRepository.getProgress(courseId, userId);
        return progress;
    }

    async createProgress(courseId: string, userId: string, progress: IVideoProgress[], lastWatchedAt: Date, totalCompletedPercent: number): Promise<ICourseProgress | null> {
        const newProgress = await this._courseRepository.createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent);
        return newProgress;
    }

    async updateProgress(courseProgress: ICourseProgress): Promise<ICourseProgress | null> {
        const progress = await this._courseRepository.updateProgress(courseProgress);
        return progress;
    }
}


export default CourseService;