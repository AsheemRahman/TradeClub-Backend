import { Types } from "mongoose";
import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import { CourseProgress, ICourseProgress, IVideoProgress } from "../../../model/user/progressSchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {
    async getCategory(): Promise<ICategory[] | null> {
        const category = await Category.find().sort({ createdAt: -1 });
        return category;
    };

    async getCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find().sort({ createdAt: -1 });
        return courses;
    };

    async getCourseById(id: string): Promise<ICourse | null> {
        const courses = await Course.findById(id);
        return courses;
    };

    async updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null> {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { $addToSet: { purchasedUsers } }, { new: true });
        return updatedCourse;
    };

    async getCourseByUser(userId: string): Promise<ICourse[] | null> {
        const course = await Course.find({ purchasedUsers: userId });
        return course;
    };

    async getProgress(courseId: string, userId: string): Promise<ICourseProgress | null> {
        const progress = await CourseProgress.findOne({ user: userId, course: courseId });
        return progress;
    };

    async getAllProgress( userId: string): Promise<ICourseProgress[] | null> {
        const progress = await CourseProgress.find({ user: userId});
        return progress;
    };

    async createProgress(userId: string, courseId: string, progress: IVideoProgress[], lastWatchedAt: Date, totalCompletedPercent: number): Promise<ICourseProgress | null> {
        const newProgress = await CourseProgress.create({ user: userId, course: courseId, progress, totalCompletedPercent, lastWatchedAt });
        return newProgress;
    };

    async updateProgress(courseProgress: ICourseProgress): Promise<ICourseProgress | null> {
        const newProgress = await CourseProgress.findOneAndUpdate({ _id: courseProgress._id }, { $set: courseProgress }, { new: true });
        return newProgress;
    };
}

export default CourseRepository;