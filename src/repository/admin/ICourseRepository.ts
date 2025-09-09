import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";


interface ICourseRepository {

    //----------------------- Category -----------------------

    getCategory(): Promise<ICategory[] | null>;
    getCategoryById(categoryId: string): Promise<ICategory | null>;
    addCategory(categoryName: string): Promise<ICategory | null>;
    editCategory(categoryId: string, categoryName: string): Promise<ICategory | null>;
    deleteCategory(categoryId: string): Promise<ICategory | null>;
    categoryStatus(categoryId: string, status: boolean): Promise<ICategory | null>;

    //------------------------ Course ------------------------

    getCourse(): Promise<ICourse[] | null>;
    getCourseById(courseId: string): Promise<ICourse | null>;
    addCourse(courseData: ICourse): Promise<ICourse | null>;
    editCourse(courseId: string, courseData: ICourse): Promise<ICourse | null>;
    deleteCourse(courseId: string): Promise<ICourse | null>;
    togglePublish(courseId: string, isPublished: boolean): Promise<ICourse | null>;
}

export default ICourseRepository;