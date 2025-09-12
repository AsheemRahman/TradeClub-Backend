import { ICategory } from "../../model/admin/categorySchema";
import { IExpert } from "../../model/expert/expertSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUser } from "../../model/user/userSchema";
import { GetUsersParams } from "../../types/IAdmin";


interface IAdminRepository {
    getUsers(params: GetUsersParams): Promise<IUser[] | null>;
    getUserCount(): Promise<number>;
    getUserById(userId: string): Promise<IUser | null>;
    userUpdateStatus(userId: string, status: string): Promise<IUser | null>;

    getExperts(params: GetUsersParams): Promise<IExpert[] | null>;
    getExpertById(expertId: string): Promise<IExpert | null>;
    getExpertCount(): Promise<number>;
    expertUpdateStatus(expertId: string, status: string): Promise<IExpert | null>;
    approveExpert(expertId: string): Promise<IExpert | null>;
    declineExpert(expertId: string): Promise<IExpert | null>;

    getOrders(): Promise<IOrder[] | null>;
}

export default IAdminRepository;