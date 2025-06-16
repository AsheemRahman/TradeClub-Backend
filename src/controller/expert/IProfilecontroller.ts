import { Request, Response } from "express";


interface IProfileController {
    getExpertData(req: Request, res: Response): Promise<void>;
}

export default IProfileController;