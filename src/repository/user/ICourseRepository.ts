import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";
import { ICourseProgress } from "../../model/user/progressSchema";


interface ICourseRepository {
    getCourse(): Promise<ICourse[] | null>;
    getCategory(): Promise<ICategory[] | null>;
    getCourseById(id: string): Promise<ICourse | null>;
    getProgress(courseId: string, userId: string): Promise<ICourseProgress | null>;
}


export default ICourseRepository;