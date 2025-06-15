import { OTPType } from "../../model/user/otp";
import { IUser } from "../../model/user/userSchema";
import { IUserType } from "../../types/IUser";


interface IUserRepository {
    findUser(email: string): Promise<IUser | null>;
    registerUser(userData: IUserType): Promise<IUser | null>;
    resetPassword(email: string, hashedPassword: string): Promise<IUser | null>;

    storeOtp(email: string, otp: number): Promise<OTPType | null>;
    findOtp(email: string): Promise<OTPType | null>;
    storeResendOtp(email: string, otp: number): Promise<OTPType | null>;

    getUserById(id: string): Promise<IUser | null>;
    updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
}


export default IUserRepository;