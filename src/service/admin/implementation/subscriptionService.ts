import ISubscriptionService from "../ISubscriptionService";
import ISubscriptionRepository from "../../../repository/admin/IAdminRepository";



class SubscriptionService implements ISubscriptionService {

    private subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

}

export default SubscriptionService;