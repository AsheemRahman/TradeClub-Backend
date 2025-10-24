import IChatController from '../controller/chat/IChatController';
import ChatController from '../controller/chat/implementation/chatController';
import ChatService from '../service/chat/implementation/chatService';
import ChatRepository from '../repository/chat/implementation/chatRepository';

import IMessageController from '../controller/chat/IMessageController';
import MessageController from '../controller/chat/implementation/messageController';
import MessageService from '../service/chat/implementation/messageService';
import MessageRepository from '../repository/chat/implementation/messageRepository';


const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController: IChatController = new ChatController(chatService);


const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);
const messageController: IMessageController = new MessageController(messageService)


export {
    chatController,
    messageController,
};