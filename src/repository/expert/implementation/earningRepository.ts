import IEarningRepository from "../IEarningRepository";
import ExpertEarning, { IExpertEarning } from "../../../model/expert/ExpertEarning";

interface IPendingAggregate {
    _id: string;      // expertId
    total: number;
}

class EarningRepository implements IEarningRepository {

    async createEarning(data: Partial<IExpertEarning>): Promise<IExpertEarning | null> {
        return ExpertEarning.create(data);
    }

    async findPendingByExpert(expertId: string): Promise<IExpertEarning[] | null> {
        return ExpertEarning.find({ expertId, status: "pending" });
    }

    async aggregatePending(): Promise<IPendingAggregate[]> {
        return ExpertEarning.aggregate([ { $match: { status: "pending" } }, { $group: { _id: "$expertId", total: { $sum: "$amount" } } },]);
    }

    async markAsPaid(expertId: string): Promise<void> {
        await ExpertEarning.updateMany(
            { expertId, status: "pending" },
            { $set: { status: "paid", paidAt: new Date() } }
        );
    }
}

export default EarningRepository;
