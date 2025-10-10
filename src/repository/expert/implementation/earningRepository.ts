import IEarningRepository from "../IEarningRepository";
import ExpertEarning, { IExpertEarning } from "../../../model/expert/expertEarning";
import { BaseRepository } from "../../base/implementation/baseRepository";

interface IPendingAggregate {
    _id: string;      // expertId
    total: number;
}

class EarningRepository extends BaseRepository<IExpertEarning> implements IEarningRepository {
    constructor() {
        super(ExpertEarning)
    }

    async createEarning(data: Partial<IExpertEarning>): Promise<IExpertEarning | null> {
        return ExpertEarning.create(data);
    }

    async findPendingByExpert(expertId: string): Promise<IExpertEarning[] | null> {
        return ExpertEarning.find({ expertId, status: "pending" });
    }

    async aggregatePending(): Promise<IPendingAggregate[]> {
        return ExpertEarning.aggregate([{ $match: { status: "pending" } }, { $group: { _id: "$expertId", total: { $sum: "$amount" } } },]);
    }

    async markAsPaid(expertId: string): Promise<void> {
        await ExpertEarning.updateMany(
            { expertId, status: "pending" },
            { $set: { status: "paid", paidAt: new Date() } }
        );
    }

    async getPendingPayouts(): Promise<IExpertEarning[]> {
        return ExpertEarning.aggregate([
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

    async getLastPayoutDate(): Promise<Date | null> {
        const lastPaid = await ExpertEarning.findOne({ status: "paid" })
            .sort({ paidAt: -1 })
            .select("paidAt");
        return lastPaid?.paidAt || null;
    }
}

export default EarningRepository;
