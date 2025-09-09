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

    async getCategoryById(categoryId: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.getCategoryById(categoryId);
        return Category;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.addCategory(categoryName);
        return Category;
    }

    async editCategory(categoryId: string, categoryName: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.editCategory(categoryId, categoryName);
        return Category;
    }

    async deleteCategory(categoryId: string): Promise<ICategory | null> {
        const Category = await this._courseRepository.deleteCategory(categoryId);
        return Category;
    }

    async categoryStatus(categoryId: string, status: boolean): Promise<ICategory | null> {
        const category = await this._courseRepository.categoryStatus(categoryId, status);
        return category;
    }

    //------------------------- Course -------------------------

    async getCourseById(courseId: string): Promise<ICourse | null> {
        const Course = await this._courseRepository.getCourseById(courseId);
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

    async editCourse(courseId: string, courseData: ICourse): Promise<ICourse | null> {
        const Courses = await this._courseRepository.editCourse(courseId, courseData);
        return Courses;
    }

    async deleteCourse(courseId: string): Promise<ICourse | null> {
        const course = await this._courseRepository.deleteCourse(courseId);
        return course;
    }

    async togglePublish(courseId: string, isPublished: boolean): Promise<ICourse | null> {
        const course = await this._courseRepository.togglePublish(courseId, isPublished);
        return course;
    }
}

export default CourseService;