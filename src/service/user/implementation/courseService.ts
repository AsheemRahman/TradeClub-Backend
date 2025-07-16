import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/user/ICourseRepository";

import { ICourse } from "../../../model/admin/courseSchema";
import { ICategory } from "../../../model/admin/categorySchema";
import { ICourseProgress, IVideoProgress } from "../../../model/user/progressSchema";


class CourseService implements ICourseService {
    private courseRepository: ICourseRepository;

    constructor(courseRepository: ICourseRepository) {
        this.courseRepository = courseRepository;
    };

    async getCourse(): Promise<ICourse[] | null> {
        const Courses = await this.courseRepository.getCourse();
        return Courses;
    }

    async getCategory(): Promise<ICategory[] | null> {
        const Category = await this.courseRepository.getCategory();
        return Category;
    }

    async getCourseById(id: string): Promise<ICourse | null> {
        const Course = await this.courseRepository.getCourseById(id);
        return Course;
    }

    async updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null> {
        const Courses = await this.courseRepository.updateCourse(courseId, purchasedUsers);
        return Courses;
    }

    async getProgress(courseId: string, userId: string): Promise<ICourseProgress | null> {
        const progress = await this.courseRepository.getProgress(courseId, userId);
        return progress;
    }

    async createProgress(courseId: string, userId: string, progress: IVideoProgress[], lastWatchedAt: Date, totalCompletedPercent: number): Promise<ICourseProgress | null> {
        const newProgress = await this.courseRepository.createProgress(courseId, userId, progress, lastWatchedAt, totalCompletedPercent);
        return newProgress;
    }

    async updateProgress(courseProgress: ICourseProgress): Promise<ICourseProgress | null> {
        const progress = await this.courseRepository.updateProgress(courseProgress);
        return progress;
    }
}


export default CourseService;