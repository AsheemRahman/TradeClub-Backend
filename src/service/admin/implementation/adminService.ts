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

    async getUserById(userId: string): Promise<IUser | null> {
        const user = await this._adminRepository.getUserById(userId);
        return user;
    }

    async userUpdateStatus(userId: string, status: string): Promise<IUser | null> {
        const user = await this._adminRepository.userUpdateStatus(userId, status);
        return user;
    }

    async getExperts(params: GetUsersParams): Promise<{ experts: IExpert[] | null; total: number }> {
        const [experts, totalExperts] = await Promise.all([
            this._adminRepository.getExperts(params),
            this._adminRepository.getExpertCount(),
        ]);
        return { experts: experts ?? null, total: totalExperts, };
    }

    async expertUpdateStatus(expertId: string, status: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.expertUpdateStatus(expertId, status);
        return expert;
    }

    async getExpertById(expertId: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.getExpertById(expertId);
        return expert;
    }

    async approveExpert(expertId: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.approveExpert(expertId);
        return expert;
    }

    async declineExpert(expertId: string): Promise<IExpert | null> {
        const expert = await this._adminRepository.declineExpert(expertId);
        return expert;
    }

    async getOrders(params: {
        page: number;
        limit: number;
        status: string;
        type: string;
        search: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{ orders: IOrder[]; total: number }> {
        return this._adminRepository.getOrders(params);
    }

    async getPaidOrders(): Promise<IOrder[] | []> {
        const order = await this._adminRepository.getPaidOrders();
        return order;
    }
}

export default AdminService;