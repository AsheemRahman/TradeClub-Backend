import IAdminService from "../IAdminService";
import IAdminRepository from "../../../repository/admin/IAdminRepository";
import { IUser } from "../../../model/user/userSchema";
import { IExpert } from "../../../model/expert/expertSchema";


class AdminService implements IAdminService {

    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async getUsers(): Promise<{ users: IUser[] | null; total: number }> {
        const [users, totalUsers] = await Promise.all([
            this.adminRepository.getUsers(),
            this.adminRepository.getUserCount(),
        ]);
        return { users: users ?? null, total: totalUsers, };
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await this.adminRepository.getUserById(id);
        return user;
    }

    async userUpdateStatus(id: string, status: string): Promise<IUser | null> {
        const user = await this.adminRepository.userUpdateStatus(id, status);
        return user;
    }

    async getExperts(): Promise<{ experts: IExpert[] | null; total: number }> {
        const [experts, totalExperts] = await Promise.all([
            this.adminRepository.getExperts(),
            this.adminRepository.getExpertCount(),
        ]);
        return { experts: experts ?? null, total: totalExperts, };
    }

    async expertUpdateStatus(id: string, status: string): Promise<IExpert | null> {
        const expert = await this.adminRepository.expertUpdateStatus(id, status);
        return expert;
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const expert = await this.adminRepository.getExpertById(id);
        return expert;
    }

    async approveExpert(id: string): Promise<IExpert | null> {
        const expert = await this.adminRepository.approveExpert(id);
        return expert;
    }

    async declineExpert(id: string): Promise<IExpert | null> {
        const expert = await this.adminRepository.declineExpert(id);
        return expert;
    }
}

export default AdminService;