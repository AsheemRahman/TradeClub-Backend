import { IChat } from "../../model/shared/chatSchema";
import { UserMinimal } from "../../types/IShared";

interface IChatService {
    getChats(userId: string, role: string): Promise<UserMinimal[] | null>;
    createChat(receiverId: string, userId: string): Promise<IChat | null>
}

export default IChatService