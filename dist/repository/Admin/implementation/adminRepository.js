"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("../../../model/user/userSchema");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const orderSchema_1 = require("../../../model/user/orderSchema");
class AdminRepository {
    getUsers(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, status, page, limit } = params;
            const query = {};
            if (search) {
                query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
            }
            if (status) {
                query.isActive = status === "active";
            }
            const skip = (page - 1) * limit;
            return yield userSchema_1.User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        });
    }
    ;
    getUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSchema_1.User.find().countDocuments();
        });
    }
    ;
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.User.findOne({ _id: userId });
            return user;
        });
    }
    ;
    userUpdateStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.User.findByIdAndUpdate(userId, { isActive: status }, { new: true });
            return user;
        });
    }
    ;
    getExperts(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, page, limit } = params;
            const query = {};
            if (search) {
                query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } },];
            }
            const skip = (page - 1) * limit;
            return yield expertSchema_1.Expert.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        });
    }
    ;
    getExpertById(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield expertSchema_1.Expert.findOne({ _id: expertId });
            return user;
        });
    }
    ;
    getExpertCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expertSchema_1.Expert.find().countDocuments();
        });
    }
    ;
    expertUpdateStatus(expertId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield expertSchema_1.Expert.findByIdAndUpdate(expertId, { isActive: status }, { new: true });
            return expert;
        });
    }
    ;
    approveExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield expertSchema_1.Expert.findByIdAndUpdate(expertId, { isVerified: "Approved" }, { new: true });
            return expert;
        });
    }
    ;
    declineExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield expertSchema_1.Expert.findByIdAndUpdate(expertId, { isVerified: "Declined" }, { new: true });
            return expert;
        });
    }
    ;
    getOrders(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const total = yield orderSchema_1.Order.countDocuments(query);
            const orders = yield orderSchema_1.Order.find(query).sort(sortOptions).skip((page - 1) * limit).limit(limit).populate('userId', 'fullName email').populate('itemId');
            return { orders, total };
        });
    }
    getPaidOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const expert = yield orderSchema_1.Order.find({ paymentStatus: "paid" });
            return expert;
        });
    }
    ;
}
exports.default = AdminRepository;
