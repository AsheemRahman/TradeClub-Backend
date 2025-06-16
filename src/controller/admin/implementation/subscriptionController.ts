import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/message";
import { STATUS_CODES } from "../../../constants/statusCode";

import ISubscriptionController from "../ISubscriptionController";
import ISubscriptionService from "../../../service/admin/IAdminService";


class SubscriptionController implements ISubscriptionController {

    private SubscriptionService: ISubscriptionService;

    constructor(SubscriptionService: ISubscriptionService) {
        this.SubscriptionService = SubscriptionService;
    }

}

export default SubscriptionController;