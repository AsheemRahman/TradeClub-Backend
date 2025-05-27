import { IExpert } from "../../model/expert/expertSchema";
import { IUser } from "../../model/user/userSchema";


interface IAdminService {

    getUsers(): Promise<{ users: IUser[] | null; total: number }>
    getUserById(id: string): Promise<IUser | null>
    userUpdateStatus(id: string, status: string): Promise<IUser | null>

    getExperts(): Promise<{ experts: IExpert[] | null; total: number }>
    getExpertById(id: string): Promise<IExpert | null>
    expertUpdateStatus(id: string, status: string): Promise<IExpert | null>
    approveExpert(id: string): Promise<IExpert | null>
    declineExpert(id: string): Promise<IExpert | null>
}

export default IAdminService