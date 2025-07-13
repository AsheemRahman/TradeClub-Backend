import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/user/ICourseRepository";

import { ICourse } from "../../../model/admin/courseSchema";
import { ICategory } from "../../../model/admin/categorySchema";


class CourseService implements ICourseService {
    private courseRepository: ICourseRepository;

    constructor(courseRepository: ICourseRepository) {
        this.courseRepository = courseRepository;
    };

    async getCourse(): Promise<ICourse[] | null> {
        const Courses = await this.courseRepository.getCourse();
        return Courses;
    }

    async getCategory(): Promise<ICategory[] | null> {
        const Category = await this.courseRepository.getCategory();
        return Category;
    }

    async getCourseById(id: string): Promise<ICourse | null> {
        const Course = await this.courseRepository.getCourseById(id);
        return Course;
    }
}


export default CourseService;