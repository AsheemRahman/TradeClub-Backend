"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expertEarning_1 = __importDefault(require("../../../model/expert/expertEarning"));
const baseRepository_1 = require("../../base/implementation/baseRepository");
class EarningRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(expertEarning_1.default);
    }
    async createEarning(data) {
        return expertEarning_1.default.create(data);
    }
    async findPendingByExpert(expertId) {
        return expertEarning_1.default.find({ expertId, status: "pending" });
    }
    async aggregatePending() {
        return expertEarning_1.default.aggregate([{ $match: { status: "pending" } }, { $group: { _id: "$expertId", total: { $sum: "$amount" } } },]);
    }
    async markAsPaid(expertId) {
        await expertEarning_1.default.updateMany({ expertId, status: "pending" }, { $set: { status: "paid", paidAt: new Date() } });
    }
    async getPendingPayouts() {
        return expertEarning_1.default.aggregate([
            { $match: { status: "pending" } },
            {
                $group: {
                    _id: "$expertId",
                    pendingAmount: { $sum: "$amount" },
                    sessions: { $push: "$sessionId" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "experts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "expert"
                }
            },
            { $unwind: "$expert" },
            {
                $project: {
                    expertId: "$_id",
                    name: "$expert.name",
                    email: "$expert.email",
                    pendingAmount: 1,
                    count: 1
                }
            }
        ]);
    }
    async getLastPayoutDate() {
        const lastPaid = await expertEarning_1.default.findOne({ status: "paid" })
            .sort({ paidAt: -1 })
            .select("paidAt");
        return lastPaid?.paidAt || null;
    }
}
exports.default = EarningRepository;
//# sourceMappingURL=earningRepository.js.map