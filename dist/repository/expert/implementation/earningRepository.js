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
    createEarning(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return expertEarning_1.default.create(data);
        });
    }
    findPendingByExpert(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return expertEarning_1.default.find({ expertId, status: "pending" });
        });
    }
    aggregatePending() {
        return __awaiter(this, void 0, void 0, function* () {
            return expertEarning_1.default.aggregate([{ $match: { status: "pending" } }, { $group: { _id: "$expertId", total: { $sum: "$amount" } } },]);
        });
    }
    markAsPaid(expertId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield expertEarning_1.default.updateMany({ expertId, status: "pending" }, { $set: { status: "paid", paidAt: new Date() } });
        });
    }
    getPendingPayouts() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getLastPayoutDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const lastPaid = yield expertEarning_1.default.findOne({ status: "paid" })
                .sort({ paidAt: -1 })
                .select("paidAt");
            return (lastPaid === null || lastPaid === void 0 ? void 0 : lastPaid.paidAt) || null;
        });
    }
}
exports.default = EarningRepository;
