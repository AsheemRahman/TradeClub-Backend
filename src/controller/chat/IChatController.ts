import { NextFunction, Request, Response } from "express";

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface IChatController{
    getChats: ControllerMethod;
    createChat: ControllerMethod;
}

export default IChatController