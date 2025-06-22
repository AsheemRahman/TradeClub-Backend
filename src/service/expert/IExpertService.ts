import { IExpert } from "../../model/expert/expertSchema";
import { OTPType } from "../../model/user/otp";
import { ExpertFormData } from "../../types/IExpert";
import { IUserType } from "../../types/IUser";

interface IExpertService {
    findExpertByEmail(email: string): Promise<IExpert | null>;
    registerExpert(userData: IUserType): Promise<IExpert | null>;
    resetPassword(email: string, password: string): Promise<IExpert | null>

    storeOtp(email: string, otp: number): Promise<OTPType | null>
    findOtp(email: string): Promise<OTPType | null>
    storeResendOtp(email: string, otp: number): Promise<OTPType | null>

    updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null>;

    getExpertById(id: string): Promise<IExpert | null>;
    updateExpertById(id: string, updateData: Partial<IExpert>): Promise<IExpert | null>;
}

export default IExpertService;