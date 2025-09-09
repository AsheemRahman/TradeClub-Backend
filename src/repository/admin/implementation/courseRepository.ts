import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {

    //------------------------ Category ------------------------

    async getCategory(): Promise<ICategory[] | null> {
        const category = await Category.find().sort({ createdAt: -1 });
        return category;
    }

    async getCategoryById(categoryId: string): Promise<ICategory | null> {
        const category = await Category.findById(categoryId);
        return category;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const newCategory = await Category.create({ categoryName });
        return newCategory;
    }

    async editCategory(categoryId: string, categoryName: string): Promise<ICategory | null> {
        const newCategory = await Category.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
        return newCategory;
    }

    async deleteCategory(categoryId: string): Promise<ICategory | null> {
        const newCategory = await Category.findByIdAndDelete(categoryId);
        return newCategory;
    }

    async categoryStatus(categoryId: string, status: boolean): Promise<ICategory | null> {
        const category = await Category.findByIdAndUpdate(categoryId, { isActive: status }, { new: true });
        return category;
    }

    //------------------------- Course -------------------------

    async getCourseById(courseId: string): Promise<ICourse | null> {
        const courses = await Course.findById(courseId);
        return courses;
    }

    async getCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find().sort({ createdAt: -1 });
        return courses;
    }

    async addCourse(courseData: ICourse): Promise<ICourse | null> {
        const newCourses = await Course.create(courseData);
        return newCourses;
    }

    async editCourse(courseId: string, courseData: ICourse): Promise<ICourse | null> {
        const newCourses = await Course.findByIdAndUpdate(courseId, { ...courseData }, { new: true });
        return newCourses;
    }

    async deleteCourse(courseId: string): Promise<ICourse | null> {
        const course = await Course.findByIdAndDelete(courseId);
        return course;
    }

    async togglePublish(courseId: string, isPublished: boolean): Promise<ICourse | null> {
        const course = await Course.findByIdAndUpdate(courseId, { isPublished }, { new: true });
        return course;
    }
}

export default CourseRepository;