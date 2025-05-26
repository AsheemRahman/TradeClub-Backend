import { OTPType } from "../../model/user/otp";
import { IUser } from "../../model/user/userSchema";
import { IUserType } from "../../types/IUser";

interface IExpertService {
    findExpertByEmail(email: string): Promise<IUser | null>;
    registerExpert(userData: IUserType): Promise<IUser | null>;
    resetPassword(email: string, password: string): Promise<IUser | null>

    storeOtp(email: string, otp: number): Promise<OTPType | null>
    findOtp(email: string): Promise<OTPType | null>
    storeResendOtp(email: string, otp: number): Promise<OTPType | null>
}

export default IExpertService;