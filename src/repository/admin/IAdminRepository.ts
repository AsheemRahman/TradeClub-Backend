import { ICategory } from "../../model/admin/categorySchema";
import { IExpert } from "../../model/expert/expertSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUser } from "../../model/user/userSchema";


interface IAdminRepository {
    getUsers(): Promise<IUser[] | null>;
    getUserCount(): Promise<number>;
    getUserById(id: string): Promise<IUser | null>;
    userUpdateStatus(id: string, status: string): Promise<IUser | null>;


    getExperts(): Promise<IExpert[] | null>;
    getExpertById(id: string): Promise<IExpert | null>;
    getExpertCount(): Promise<number>;
    expertUpdateStatus(id: string, status: string): Promise<IExpert | null>;
    approveExpert(id: string): Promise<IExpert | null>;
    declineExpert(id: string): Promise<IExpert | null>;

    getOrders(): Promise<IOrder[] | null>;
}

export default IAdminRepository;