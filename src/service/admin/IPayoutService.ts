

interface IPayoutService {

    processMonthlyPayouts(): Promise<void>;
}

export default IPayoutService;