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

    async getOrders(params: { page: number; limit: number; status: string; type: string; search: string; sortBy: string; sortOrder: string; }): Promise<{ orders: IOrder[]; total: number }> {
        const { page, limit, status, type, search, sortBy, sortOrder } = params;
        const query: any = {};
        if (status !== "all") query.paymentStatus = status;
        if (type !== "all") query.type = type;
        if (search) {
            query.$or = [{ _id: { $regex: search, $options: "i" } }, { type: { $regex: search, $options: "i" } },];
        }
        const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1, };
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query).sort(sortOptions).skip((page - 1) * limit).limit(limit).populate('userId', 'fullName email').populate('itemId')
        return { orders, total };
    }

    async getPaidOrders(): Promise<IOrder[] | []> {
        const expert = await Order.find({ paymentStatus: "paid" })
        return expert;
    };
}

export default AdminRepository;