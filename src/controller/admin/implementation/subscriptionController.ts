import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ISubscriptionController from "../ISubscriptionController";
import ISubscriptionService from "../../../service/admin/ISubscriptionService";
import { ISubscriptionPlan } from "../../../model/admin/subscriptionSchema";


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

    async createPlan(req: Request, res: Response): Promise<void> {
        const { name, price, duration, features, accessLevel, isActive } = req.body;
        if (!name || !price || !duration || !features || !accessLevel) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.NOT_FOUND })
            return;
        }
        try {
            const planData = await this.SubscriptionService.createPlan({ name, price, duration, features, accessLevel, isActive } as ISubscriptionPlan);
            res.status(STATUS_CODES.CREATED).json({ status: true, message: "Subscription plan Created Successfully", planData })
        } catch (error) {
            console.error("Failed to create Subscription plan", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to create Subscription plan", error: error instanceof Error ? error.message : String(error), });
        }
    };

}

export default SubscriptionController;