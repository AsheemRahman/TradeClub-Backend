import { ICategory } from "../../model/admin/categorySchema";

interface ICourseService {
    getCategory(): Promise<ICategory[] | null>;
    addCategory(categoryName: string): Promise<ICategory | null>;
    editCategory(id: string, categoryName: string): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<ICategory | null>;
}

export default ICourseService;