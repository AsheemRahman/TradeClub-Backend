import Router from 'express'

import authenticationMiddleware from '../../middleware/authentication';
import { chatController, messageController } from '../../di/chatDI';


const router = Router();


router.get('/getChats', authenticationMiddleware(), chatController.getChats.bind(chatController));
router.post('/create-chat/:id', authenticationMiddleware(), chatController.createChat.bind(chatController));


router.post('/send/:id', authenticationMiddleware(), messageController.sendMessage.bind(messageController));
router.get('/get-messages/:id', authenticationMiddleware(), messageController.getMessages.bind(messageController));
router.delete('/delete-message/:id', authenticationMiddleware(), messageController.deleteMessages.bind(messageController));
router.post('/mark-read/:id', authenticationMiddleware(), messageController.markMessagesAsRead.bind(messageController))



export default router;