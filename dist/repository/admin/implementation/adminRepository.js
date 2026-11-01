"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../../../model/user/userSchema");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const orderSchema_1 = require("../../../model/user/orderSchema");
class AdminRepository {
    async getUsers(params) {
        const { search, status, page, limit } = params;
        const query = {};
        if (search) {
            query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
        }
        if (status) {
            query.isActive = status === "active";
        }
        const skip = (page - 1) * limit;
        return await userSchema_1.User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    }
    ;
    async getUserCount() {
        return await userSchema_1.User.find().countDocuments();
    }
    ;
    async getUserById(userId) {
        const user = await userSchema_1.User.findOne({ _id: userId });
        return user;
    }
    ;
    async userUpdateStatus(userId, status) {
        const user = await userSchema_1.User.findByIdAndUpdate(userId, { isActive: status }, { new: true });
        return user;
    }
    ;
    async getExperts(params) {
        const { search, page, limit } = params;
        const query = {};
        if (search) {
            query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
        }
        const skip = (page - 1) * limit;
        return await expertSchema_1.Expert.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    }
    ;
    async getExpertById(expertId) {
        const user = await expertSchema_1.Expert.findOne({ _id: expertId });
        return user;
    }
    ;
    async getExpertCount() {
        return await expertSchema_1.Expert.find().countDocuments();
    }
    ;
    async expertUpdateStatus(expertId, status) {
        const expert = await expertSchema_1.Expert.findByIdAndUpdate(expertId, { isActive: status }, { new: true });
        return expert;
    }
    ;
    async approveExpert(expertId) {
        const expert = await expertSchema_1.Expert.findByIdAndUpdate(expertId, { isVerified: "Approved" }, { new: true });
        return expert;
    }
    ;
    async declineExpert(expertId) {
        const expert = await expertSchema_1.Expert.findByIdAndUpdate(expertId, { isVerified: "Declined" }, { new: true });
        return expert;
    }
    ;
    async getOrders(params) {
        const { page, limit, status, type, search, sortBy, sortOrder } = params;
        const query = {};
        if (status !== "all")
            query.paymentStatus = status;
        if (type !== "all")
            query.type = type;
        if (search) {
            query.$or = [{ _id: { $regex: search, $options: "i" } }, { type: { $regex: search, $options: "i" } },];
        }
        const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1, };
        const total = await orderSchema_1.Order.countDocuments(query);
        const orders = await orderSchema_1.Order.find(query).sort(sortOptions).skip((page - 1) * limit).limit(limit).populate('userId', 'fullName email').populate('itemId');
        return { orders, total };
    }
    async getPaidOrders() {
        const expert = await orderSchema_1.Order.find({ paymentStatus: "paid" });
        return expert;
    }
    ;
}
exports.default = AdminRepository;
//# sourceMappingURL=adminRepository.js.map