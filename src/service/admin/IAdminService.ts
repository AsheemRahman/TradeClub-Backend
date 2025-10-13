import { IExpert } from "../../model/expert/expertSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUser } from "../../model/user/userSchema";
import { GetUsersParams } from "../../types/IAdmin";


interface IAdminService {

    getUsers(params: GetUsersParams): Promise<{ users: IUser[] | null; total: number }>;
    getUserById(userId: string): Promise<IUser | null>;
    userUpdateStatus(userId: string, status: string): Promise<IUser | null>;

    getExperts(params: GetUsersParams): Promise<{ experts: IExpert[] | null; total: number }>;
    getExpertById(expertId: string): Promise<IExpert | null>;
    expertUpdateStatus(expertId: string, status: string): Promise<IExpert | null>;
    approveExpert(expertId: string): Promise<IExpert | null>;
    declineExpert(expertId: string): Promise<IExpert | null>;

    getOrders(params: {
        page: number; limit: number; status: string;
        type: string; search: string; sortBy: string; sortOrder: string;
    }): Promise<{ orders: IOrder[]; total: number }>
    getPaidOrders(): Promise<IOrder[] | []>

    getStats(): Promise<{ totalCustomers: number; totalExperts: number }>;
}

export default IAdminService;