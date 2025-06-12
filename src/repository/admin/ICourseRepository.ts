import { ICategory } from "../../model/admin/categorySchema";


interface ICourseRepository {
    addCategory(categoryName: string): Promise<ICategory | null>;
}

export default ICourseRepository;