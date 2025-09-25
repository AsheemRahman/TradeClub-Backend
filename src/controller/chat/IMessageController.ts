import { NextFunction, Request, Response } from "express"

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<any>;

interface IMessageController {
    sendMessage: ControllerMethod;
    getMessages: ControllerMethod;
    deleteMessages: ControllerMethod;
    markMessagesAsRead: ControllerMethod;

}

export default IMessageController