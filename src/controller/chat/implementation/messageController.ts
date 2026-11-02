import { Request, Response } from 'express';
import IMessageService from '../../../service/chat/IMessageService';
import IMessageController from '../IMessageController';
import { STATUS_CODES } from '../../../constants/statusCode';
import { asyncHandler } from '../../../utils/asyncHandler';

class MessageController implements IMessageController {
    private _messageService: IMessageService;

    constructor(messageService: IMessageService) {
        this._messageService = messageService;
    }

    sendMessage = asyncHandler(async (req: Request, res: Response) => {
        const { id: receiverId } = req.params;
        const { message, imageUrl } = req.body;
        const senderId = req.userId as string;
        const response = await this._messageService.sendMessage(receiverId, senderId, message, imageUrl);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: 'Message sent successfully',
            data: response,
        });
    });

    getMessages = asyncHandler(async (req: Request, res: Response) => {
        const { id: userToChat } = req.params;
        const senderId = req.userId as string;
        const response = await this._messageService.getMessage(userToChat, senderId);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: response,
        });
    });

    deleteMessages = asyncHandler(async (req: Request, res: Response) => {
        const { id: receiverId } = req.params;
        const messagesIds = req.body.messageIds;
        const response = await this._messageService.deleteMessages(receiverId, messagesIds);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Messages deleted successfully',
            data: response,
        });
    });

    markMessagesAsRead = asyncHandler(async (req: Request, res: Response) => {
        const { id: receiverId } = req.params;
        const senderId = req.userId as string;
        const response = await this._messageService.markMessagesAsRead(receiverId, senderId);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: 'Messages marked as read',
            data: response,
        });
    });
}

export default MessageController;