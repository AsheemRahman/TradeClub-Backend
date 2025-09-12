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

    async getCourse(filters: { search: string; category?: string; minPrice: number; maxPrice: number; sort: string; page: number; limit: number; }): Promise<{ courses: ICourse[]; totalPages: number; totalCourses: number }> {
        const { search, category, minPrice, maxPrice, sort, page, limit } = filters;
        const query: any = { price: { $gte: minPrice, $lte: maxPrice } };
        if (category) query.category = category;
        if (search) query.title = { $regex: search, $options: 'i' };
        const sortOption: Record<string, 1 | -1> = {};
        switch (sort) {
            case 'price-low':
                sortOption.price = 1;
                break;
            case 'price-high':
                sortOption.price = -1;
                break;
            case 'oldest':
                sortOption.createdAt = 1;
                break;
            default:
                sortOption.createdAt = -1;
        }
        const skip = (page - 1) * limit;
        // Fetch courses
        const [courses, totalCourses] = await Promise.all([
            Course.find(query).sort(sortOption).skip(skip).limit(limit),
            Course.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCourses / limit);
        return { courses, totalPages, totalCourses };
    }

    async getCourseById(courseId: string): Promise<ICourse | null> {
        const courses = await Course.findById(courseId);
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

    async getAllProgress(userId: string): Promise<ICourseProgress[] | null> {
        const progress = await CourseProgress.find({ user: userId });
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