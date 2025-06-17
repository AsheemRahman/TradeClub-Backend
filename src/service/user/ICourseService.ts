import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";


interface ICourseService {
    getCategory(): Promise<ICategory[] | null>;
    getCourse(): Promise<ICourse[] | null>;
}

export default ICourseService;