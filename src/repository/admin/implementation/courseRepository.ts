import Category, { ICategory } from "../../../model/admin/categorySchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {

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
}

export default CourseRepository;