import { IExpert } from "../../model/expert/expertSchema";
import { OTPType } from "../../model/user/otp";
import { IUserType } from "../../types/IUser";

interface IExpertRepository {

    findUser(email: string): Promise<IExpert | null>
    registerUser(userData: IUserType): Promise<IExpert | null>;
    resetPassword(email: string, hashedPassword: string): Promise<IExpert | null>

    storeOtp(email: string, otp: number): Promise<OTPType | null>
    findOtp(email: string): Promise<OTPType | null>
    storeResendOtp(email: string, otp: number): Promise<OTPType | null>
}


export default IExpertRepository;