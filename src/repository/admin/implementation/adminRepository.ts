import IAdminRepository from "../IAdminRepository";
import { IUser, User } from "../../../model/user/userSchema";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { IOrder, Order } from "../../../model/user/orderSchema";
import { GetUsersParams } from "../../../types/IAdmin";


class AdminRepository implements IAdminRepository {

    async getUsers(params: GetUsersParams): Promise<IUser[] | null> {
        const { search, status, page, limit } = params;
        const query: any = {};
        if (search) {
            query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
        }
        if (status) {
            query.isActive = status === "active";
        }
        const skip = (page - 1) * limit;
        return await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    };

    async getUserCount(): Promise<number> {
        return await User.find().countDocuments();
    };

    async getUserById(userId: string): Promise<IUser | null> {
        const user = await User.findOne({ _id: userId });
        return user;
    };

    async userUpdateStatus(userId: string, status: string): Promise<IUser | null> {
        const user = await User.findByIdAndUpdate(userId, { isActive: status }, { new: true });
        return user;
    };

    async getExperts(params: GetUsersParams): Promise<IExpert[] | null> {
        const { search, page, limit } = params;
        const query: any = {};
        if (search) {
            query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
        }
        const skip = (page - 1) * limit;
        return await Expert.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    };

    async getExpertById(expertId: string): Promise<IExpert | null> {
        const user = await Expert.findOne({ _id: expertId });
        return user;
    };

    async getExpertCount(): Promise<number> {
        return await Expert.find().countDocuments();
    };

    async expertUpdateStatus(expertId: string, status: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(expertId, { isActive: status }, { new: true });
        return expert;
    };

    async approveExpert(expertId: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(expertId, { isVerified: "Approved" }, { new: true });
        return expert;
    };

    async declineExpert(expertId: string): Promise<IExpert | null> {
        const expert = await Expert.findByIdAndUpdate(expertId, { isVerified: "Declined" }, { new: true });
        return expert;
    };

    async getOrders(): Promise<IOrder[] | null> {
        const expert = await Order.find()
        return expert;
    };
}

export default AdminRepository;