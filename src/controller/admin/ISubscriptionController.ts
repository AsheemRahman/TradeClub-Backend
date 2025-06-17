import { Request, Response } from "express"

interface ISubscriptionController {
    fetchPlans(req: Request, res: Response): Promise<void>;
    createPlan(req: Request, res: Response): Promise<void>;
}

export default ISubscriptionController;