import { ICategory } from "../../model/admin/categorySchema";

interface ICourseService {
    addCategory(categoryName: string): Promise<ICategory | null>;
}

export default ICourseService;