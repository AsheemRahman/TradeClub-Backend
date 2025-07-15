import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import { CourseProgress, ICourseProgress } from "../../../model/user/progressSchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {
    async getCategory(): Promise<ICategory[] | null> {
        const category = await Category.find().sort({ createdAt: -1 });
        return category;
    }

    async getCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find().sort({ createdAt: -1 });
        return courses;
    }

    async getCourseById(id: string): Promise<ICourse | null> {
        const courses = await Course.findById(id);
        return courses;
    }

    async getProgress(courseId: string, userId: string): Promise<ICourseProgress | null> {
        const progress = await CourseProgress.findOne({ user: userId, course: courseId });
        return progress;
    }
}

export default CourseRepository;