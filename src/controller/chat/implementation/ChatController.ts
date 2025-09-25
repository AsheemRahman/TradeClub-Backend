import { Request, Response } from "express";
import IChatService from "../../../service/chat/IChatService";
import IChatController from "../IChatController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/message";
import { asyncHandler } from "../../../utils/asyncHandler";

class ChatController implements IChatController {
    private _chatService: IChatService;

    constructor(chatService: IChatService) {
        this._chatService = chatService;
    }

    getChats = asyncHandler(async (req: Request, res: Response) => {
        const { role } = req.query
        const userId = req.userId
        const response = await this._chatService.getChats(userId as string, role as string);
        res.status(STATUS_CODES.OK).json({ success: true, message: "Chat retrieved successfully", data: response })
    });

    createChat = asyncHandler(async (req: Request, res: Response) => {
        const { id: receiverId } = req.params;
        const userId = req.userId;
        const response = await this._chatService.createChat(receiverId, userId as string);
        res.status(STATUS_CODES.CREATED).json({ success: true, message: "Chat created successfully", data: response })
    });
}

export default ChatController