import { IExpert } from "../../model/expert/expertSchema";
import { IOrder } from "../../model/user/orderSchema";
import { IUser } from "../../model/user/userSchema";
import { GetUsersParams } from "../../types/IAdmin";


interface IAdminService {

    getUsers(params: GetUsersParams): Promise<{ users: IUser[] | null; total: number }>;
    getUserById(id: string): Promise<IUser | null>;
    userUpdateStatus(id: string, status: string): Promise<IUser | null>;

    getExperts(): Promise<{ experts: IExpert[] | null; total: number }>;
    getExpertById(id: string): Promise<IExpert | null>;
    expertUpdateStatus(id: string, status: string): Promise<IExpert | null>;
    approveExpert(id: string): Promise<IExpert | null>;
    declineExpert(id: string): Promise<IExpert | null>;

    getOrders(): Promise<IOrder[] | null>;
}

export default IAdminService;