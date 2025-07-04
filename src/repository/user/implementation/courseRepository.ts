import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
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
}

export default CourseRepository;