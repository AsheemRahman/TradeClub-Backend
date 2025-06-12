import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/admin/ICourseRepository";

import { ICategory } from "../../../model/admin/categorySchema";


class CourseService implements ICourseService {
    private courseRepository: ICourseRepository;
    constructor(courseRepository: ICourseRepository) {
        this.courseRepository = courseRepository;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const Category = await this.courseRepository.addCategory(categoryName);
        return Category;
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const Category = await this.courseRepository.deleteCategory(id);
        return Category;
    }
}

export default CourseService;