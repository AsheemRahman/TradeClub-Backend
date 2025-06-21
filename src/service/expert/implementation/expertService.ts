
import IExpertRepository from "../../../repository/expert/IExpertRepository";
import IExpertService from "../IExpertService";
import { IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IExpert } from "../../../model/expert/expertSchema";
import { ExpertFormData } from "../../../types/IExpert";



class ExpertService implements IExpertService {
    private expertRepository: IExpertRepository;

    constructor(userRepository: IExpertRepository) {
        this.expertRepository = userRepository;
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        const user = await this.expertRepository.findExpertByEmail(email);
        return user;
    }

    async registerExpert(userData: IUserType): Promise<any> {
        if (userData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(userData.password);
            userData.password = hashedPassword;
        }
        return await this.expertRepository.registerExpert(userData);
    }

    async resetPassword(email: string, password: string): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        return await this.expertRepository.resetPassword(email, hashedPassword);
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOtp = await this.expertRepository.storeOtp(email, otp);
        return storedOtp
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this.expertRepository.findOtp(email);
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        const resendOTP = await this.expertRepository.storeResendOtp(email, otp);
        return resendOTP;
    }

    async updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null> {
        const expertDetail = await this.expertRepository.updateDetails(expertDetails)
        return expertDetail
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await this.expertRepository.getExpertById(id);
        return user;
    };
}


export default ExpertService;