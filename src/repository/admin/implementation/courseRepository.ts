import Category, { ICategory } from "../../../model/admin/categorySchema";
import ICourseRepository from "../ICourseRepository";


class CourseRepository implements ICourseRepository {

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const newCategory = await Category.create({categoryName});
        return newCategory;
    }
}

export default CourseRepository;