import ISubscriptionService from "../ISubscriptionService";
import ISubscriptionRepository from "../../../repository/admin/ISubscriptionRepository";



class SubscriptionService implements ISubscriptionService {

    private subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

}

export default SubscriptionService;