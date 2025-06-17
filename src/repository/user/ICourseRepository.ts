import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";


interface ICourseRepository {
    getCourse(): Promise<ICourse[] | null>;
    getCategory(): Promise<ICategory[] | null>;
}


export default ICourseRepository;