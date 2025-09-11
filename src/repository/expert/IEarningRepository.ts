import { IExpertEarning } from "../../model/expert/ExpertEarning";


interface IPendingAggregate {
    _id: string;      // expertId
    total: number;
}


interface IEarningRepository {
    createEarning(data: Partial<IExpertEarning>): Promise<IExpertEarning | null>;
    findPendingByExpert(expertId: string): Promise<IExpertEarning[] | null>;
    aggregatePending(): Promise<IPendingAggregate[]>;
    markAsPaid(expertId: string): Promise<void>;
}


export default IEarningRepository;