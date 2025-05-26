import { IExpert } from "../../model/expert/expertSchema";
import { IUser } from "../../model/user/userSchema";


interface IAdminRepository {
    getUsers(): Promise<IUser[] | null>
    getUserCount(): Promise<number>
    getUserById(id: string): Promise<IUser | null>
    userUpdateStatus(id: string, status: string): Promise<IUser | null>

    getExperts(): Promise<IExpert[] | null>
    getExpertById(id: string): Promise<IExpert | null>
    getExpertCount(): Promise<number>
    expertUpdateStatus(id: string, status: string): Promise<IExpert | null>
}

export default IAdminRepository