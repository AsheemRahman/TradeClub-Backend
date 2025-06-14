import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {

    //------------------------ Category ------------------------

    async getCategory(): Promise<ICategory[] | null> {
        const category = await Category.find().sort({ createdAt: -1 });
        return category;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const newCategory = await Category.create({ categoryName });
        return newCategory;
    }

    async editCategory(id: string, categoryName: string): Promise<ICategory | null> {
        const newCategory = await Category.findByIdAndUpdate(id, { categoryName }, { new: true });
        return newCategory;
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const newCategory = await Category.findByIdAndDelete(id);
        return newCategory;
    }

    //------------------------- Course -------------------------

    async getCourseById(id: string): Promise<ICourse | null> {
        const courses = await Course.findById(id);
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

    async editCourse(id: string, courseData: ICourse): Promise<ICourse | null> {
        const newCourses = await Course.findByIdAndUpdate(id, { ...courseData }, { new: true });
        return newCourses;
    }

    async deleteCourse(id: string): Promise<ICourse | null> {
        const course = await Course.findByIdAndDelete(id);
        return course;
    }

    async togglePublish(id: string, isPublished: boolean): Promise<ICourse | null> {
        const course = await Course.findByIdAndUpdate(id, { isPublished }, { new: true });
        return course;
    }
}

export default CourseRepository;