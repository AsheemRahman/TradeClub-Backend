import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";
import { ICourseProgress } from "../../model/user/progressSchema";


interface ICourseService {
    getCategory(): Promise<ICategory[] | null>;
    getCourse(): Promise<ICourse[] | null>;
    getCourseById(id: string): Promise<ICourse | null>;
    getProgress(courseId: string, userId: string): Promise<ICourseProgress | null>;
}

export default ICourseService;