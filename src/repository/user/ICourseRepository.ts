import { ICategory } from "../../model/admin/categorySchema";
import { ICourse } from "../../model/admin/courseSchema";
import { ICourseProgress, IVideoProgress } from "../../model/user/progressSchema";


interface ICourseRepository {
    getCourse(): Promise<ICourse[] | null>;
    getCategory(): Promise<ICategory[] | null>;
    getCourseById(id: string): Promise<ICourse | null>;
    updateCourse(courseId: string, purchasedUsers: string): Promise<ICourse | null>;
    getCourseByUser(userId: string): Promise<ICourse[] | null>;

    getProgress(courseId: string, userId: string): Promise<ICourseProgress | null>;
    getAllProgress( userId: string): Promise<ICourseProgress[] | null>;
    createProgress(courseId: string, userId: string, progress: IVideoProgress[], lastWatchedAt: Date, totalCompletedPercent: number): Promise<ICourseProgress | null>
    updateProgress(courseProgress: ICourseProgress): Promise<ICourseProgress | null>;
}


export default ICourseRepository;