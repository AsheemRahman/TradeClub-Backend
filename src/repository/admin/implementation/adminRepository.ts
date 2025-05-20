import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { IUser, User } from "../../../model/user/userSchema";
import IAdminRepository from "../IAdminRepository";


class AdminRepository implements IAdminRepository {

    async getUsers(): Promise<IUser[] | null> {
        const users = await User.find().sort({ createdAt: -1 })
        return users
    }

    async getUserCount(): Promise<number> {
        return await User.find().countDocuments()
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await User.findOne({ _id: id });
        return user;
    }

    async userUpdateStatus(id: string, status: string): Promise<IUser | null> {
        const user = await User.findOneAndUpdate({ id, isActive: status });
        return user;
    }

    async getExperts(): Promise<IExpert[] | null> {
        const experts = await Expert.find().sort({ createdAt: -1 })
        return experts;
    }

    async getExpertCount(): Promise<number> {
        return await Expert.find().countDocuments();
    }

    // async expertUpdateStatus(id: string, status: string): Promise<IExpert | null> {
    //     const expert = await Expert.findOneAndUpdate({ id, isActive: status });
    //     return expert;
    // }
}

export default AdminRepository