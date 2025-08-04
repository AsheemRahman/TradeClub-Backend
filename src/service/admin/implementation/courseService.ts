import ICourseService from "../ICourseService";
import ICourseRepository from "../../../repository/admin/ICourseRepository";

import { ICategory } from "../../../model/admin/categorySchema";
import { ICourse } from "../../../model/admin/courseSchema";


class CourseService implements ICourseService {

    private _courseRepository: ICourseRepository;

    constructor(courseRepository: ICourseRepository) {
        this._courseRepository = courseRepository;
    }

    //------------------------ Category ------------------------

    async getCategory(): Promise<ICategory[] | null> {
        const Category = await this._courseRepository.getCategory();
        return Category;
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.getCategoryById(id);
        return Category;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.addCategory(categoryName);
        return Category;
    }

    async editCategory(id: string, categoryName: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.editCategory(id, categoryName);
        return Category;
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.deleteCategory(id);
        return Category;
    }

    async categoryStatus(id: string, status: boolean): Promise<ICategory | null> {
        const category = await this._courseRepository.categoryStatus(id, status);
        return category;
    }

    //------------------------- Course -------------------------

    async getCourseById(id: string): Promise<ICourse | null> {
        const Course = await this._courseRepository.getCourseById(id);
        return Course;
    }

    async getCourse(): Promise<ICourse[] | null> {
        const Courses = await this._courseRepository.getCourse();
        return Courses;
    }

    async addCourse(courseData: ICourse): Promise<ICourse | null> {
        const Courses = await this._courseRepository.addCourse(courseData);
        return Courses;
    }

    async editCourse(id: string, courseData: ICourse): Promise<ICourse | null> {
        const Courses = await this._courseRepository.editCourse(id, courseData);
        return Courses;
    }

    async deleteCourse(id: string): Promise<ICourse | null> {
        const course = await this._courseRepository.deleteCourse(id);
        return course;
    }

    async togglePublish(id: string, isPublished: boolean): Promise<ICourse | null> {
        const course = await this._courseRepository.togglePublish(id, isPublished);
        return course;
    }
}

export default CourseService;