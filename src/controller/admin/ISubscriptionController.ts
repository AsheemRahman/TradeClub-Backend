import { Request, Response } from "express"

interface ISubscriptionController {
    fetchPlans(req: Request, res: Response): Promise<void>;
    createPlan(req: Request, res: Response): Promise<void>;
    updatePlan(req: Request, res: Response): Promise<void>;
    deletePlan(req: Request, res: Response): Promise<void>;
    planStatus(req: Request, res: Response): Promise<void>;
}

export default ISubscriptionController;