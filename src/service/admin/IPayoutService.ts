import { IExpertEarning } from "../../model/expert/ExpertEarning";


interface IPayoutService {
    getPendingPayouts(): Promise<IExpertEarning[]>;
    processMonthlyPayouts(): Promise<void>;
    getLastPayoutDate(): Promise<Date | null>
}

export default IPayoutService;