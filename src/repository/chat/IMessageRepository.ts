import { IMessage } from "../../model/shared/messageSchema";

interface IMessageRepository{
    sendMessage(id:string,senderId:string,message:string,imageUrl:string):Promise<IMessage | null>;
    getMessage(userToChat:string,senderId:string):Promise<IMessage[] | [] >
    deleteMessages(messagesIds:string[]):Promise<IMessage[] | [] >
    markMessagesAsRead(receiverId:string,senderId:string):Promise<boolean | null>
}
export default  IMessageRepository