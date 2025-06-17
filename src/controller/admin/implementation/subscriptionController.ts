import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ISubscriptionController from "../ISubscriptionController";
import ISubscriptionService from "../../../service/admin/ISubscriptionService";


class SubscriptionController implements ISubscriptionController {

    private SubscriptionService: ISubscriptionService;

    constructor(SubscriptionService: ISubscriptionService) {
        this.SubscriptionService = SubscriptionService;
    }

    async fetchPlans(req: Request, res: Response): Promise<void> {
        try {
            const planData = await this.SubscriptionService.fetchPlans();
            res.status(STATUS_CODES.OK).json({ status: true, message: "Subscription plan Fetched Successfully", planData })
        } catch (error) {
            console.error("Failed to fetch Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to fetch Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

}

export default SubscriptionController;