import IAdminRepository from "../IAdminRepository";
import { IUser, User } from "../../../model/user/userSchema";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { IOrder, Order } from "../../../model/user/orderSchema";


class AdminRepository implements IAdminRepository {

    async getUsers(): Promise<IUser[] | null> {
        const users = await User.find().sort({ createdAt: -1 })
        return users;
    };

    async getUserCount(): Promise<number> {
        return await User.find().countDocuments();
    };

    async getUserById(id: string): Promise<IUser | null> {
        const user = await User.findOne({ _id: id });
        return user;
    };

    async userUpdateStatus(id: string, status: string): Promise<IUser | null> {
        const user = await User.findByIdAndUpdate(id, { isActive: status }, { new: true });
        return user;
    };

    async getExperts(): Promise<IExpert[] | null> {
        const experts = await Expert.find().sort({ createdAt: -1 })
        return experts;
    };

    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await Expert.findOne({ _id: id });
        return user;
    };

    async getExpertCount(): Promise<number> {
        return await Expert.find().countDocuments();
    };

    async expertUpdateStatus(id: string, status: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(id, { isActive: status }, { new: true });
        return expert;
    };

    async approveExpert(id: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(id, { isVerified: "Approved" }, { new: true });
        return expert;
    };

    async declineExpert(id: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(id, { isVerified: "Declined" }, { new: true });
        return expert;
    };

    async getOrders(): Promise<IOrder[] | null> {
        const expert = await Order.find()
        return expert;
    };
}

export default AdminRepository;