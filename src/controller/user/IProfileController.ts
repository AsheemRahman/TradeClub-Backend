import { Request, Response } from "express";


interface IProfileController {
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;

}

export default IProfileController;