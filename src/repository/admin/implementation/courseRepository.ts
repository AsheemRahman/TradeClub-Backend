import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {

    //------------------------ Category ------------------------

    async getCategory(): Promise<ICategory[] | null> {
        const category = await Category.find();
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

    async getCourse(): Promise<ICourse[] | null> {
        const courses = await Course.find();
        return courses;
    }

    async deleteCourse(id: string): Promise<ICourse | null> {
        const course = await Course.findByIdAndDelete(id);
        return course;
    }
}

export default CourseRepository;