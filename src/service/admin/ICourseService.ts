import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";

interface ICourseService {

    //----------------------- Category -----------------------

    getCategory(): Promise<ICategory[] | null>;
    addCategory(categoryName: string): Promise<ICategory | null>;
    editCategory(id: string, categoryName: string): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<ICategory | null>;

    //------------------------ Course ------------------------

    getCourseById(id: string): Promise<ICourse | null>;
    getCourse(): Promise<ICourse[] | null>;
    addCourse(courseData: ICourse): Promise<ICourse | null>;
    // editCourse(id: string, courseData: ICourse): Promise<ICourse | null>;
    deleteCourse(id: string): Promise<ICourse | null>;
    togglePublish(id: string, isPublished: boolean): Promise<ICourse | null>;
}

export default ICourseService;