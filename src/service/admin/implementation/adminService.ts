import IAdminService from "../IAdminService";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { IUser } from "../../../model/user/userSchema";
import { IExpert } from "../../../model/expert/expertSchema";
import { IOrder } from "../../../model/user/orderSchema";
import { GetUsersParams } from "../../../types/IAdmin";



class AdminService implements IAdminService {

    private _adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    async getUsers(params: GetUsersParams): Promise<{ users: IUser[] | null; total: number }> {
        const [users, totalUsers] = await Promise.all([
            this._adminRepository.getUsers(params),
            this._adminRepository.getUserCount(),
        ]);
        return { users: users ?? null, total: totalUsers, };
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await this._adminRepository.getUserById(id);
        return user;
    }

    async userUpdateStatus(id: string, status: string): Promise<IUser | null> {
        const user = await this._adminRepository.userUpdateStatus(id, status);
        return user;
    }

    async getExperts(params: GetUsersParams): Promise<{ experts: IExpert[] | null; total: number }> {
        const [experts, totalExperts] = await Promise.all([
            this._adminRepository.getExperts(params),
            this._adminRepository.getExpertCount(),
        ]);
        return { experts: experts ?? null, total: totalExperts, };
    }

    async expertUpdateStatus(id: string, status: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.expertUpdateStatus(id, status);
        return expert;
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.getExpertById(id);
        return expert;
    }

    async approveExpert(id: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.approveExpert(id);
        return expert;
    }

    async declineExpert(id: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.declineExpert(id);
        return expert;
    }

    async getOrders(): Promise<IOrder[] | null> {
        const order = await this._adminRepository.getOrders();
        return order;
    }
}

export default AdminService;