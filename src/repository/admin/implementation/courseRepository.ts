import Category, { ICategory } from "../../../model/admin/categorySchema";
import Course, { ICourse } from "../../../model/admin/courseSchema";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import ICourseRepository from "../ICourseRepository";


class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository {
    private categoryModel = Category;

    constructor() {
        super(Course);
    }

    //------------------------ Category ------------------------

    async getCategory(): Promise<ICategory[] | null> {
        const category = await this.categoryModel.find().sort({ createdAt: -1 });
        return category;
    }

    async getCategoryById(categoryId: string): Promise<ICategory | null> {
        const category = await this.categoryModel.findById(categoryId);
        return category;
    }

    async addCategory(categoryName: string): Promise<ICategory | null> {
        const newCategory = await this.categoryModel.create({ categoryName });
        return newCategory;
    }

    async editCategory(categoryId: string, categoryName: string): Promise<ICategory | null> {
        const newCategory = await this.categoryModel.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
        return newCategory;
    }

    async deleteCategory(categoryId: string): Promise<ICategory | null> {
        const newCategory = await this.categoryModel.findByIdAndDelete(categoryId);
        return newCategory;
    }

    async categoryStatus(categoryId: string, status: boolean): Promise<ICategory | null> {
        const category = await this.categoryModel.findByIdAndUpdate(categoryId, { isActive: status }, { new: true });
        return category;
    }

    //------------------------- Course -------------------------

    async getCourseById(courseId: string): Promise<ICourse | null> {
        return this.findById(courseId);
    }

    async getCourse(): Promise<ICourse[] | null> {
        const courses = await this.model.find().sort({ createdAt: -1 });
        return courses;
    }

    async addCourse(courseData: ICourse): Promise<ICourse | null> {
        return this.create(courseData);
    }

    async editCourse(courseId: string, courseData: ICourse): Promise<ICourse | null> {
        const newCourses = await this.findByIdAndUpdate(courseId, { ...courseData });
        return newCourses;
    }

    async deleteCourse(courseId: string): Promise<ICourse | null> {
        const course = await this.delete(courseId);
        return course;
    }

    async togglePublish(courseId: string, isPublished: boolean): Promise<ICourse | null> {
        const course = await this.findByIdAndUpdate(courseId, { isPublished });
        return course;
    }
}

export default CourseRepository;