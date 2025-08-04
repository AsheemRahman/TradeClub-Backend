
import IExpertRepository from "../../../repository/expert/IExpertRepository";
import IExpertService from "../IExpertService";
import { IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IExpert } from "../../../model/expert/expertSchema";
import { ExpertFormData } from "../../../types/IExpert";
import { IExpertWallet } from "../../../model/expert/walletSchema";


class ExpertService implements IExpertService {
    private _expertRepository: IExpertRepository;
    constructor(userRepository: IExpertRepository) {
        this._expertRepository = userRepository;
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        const user = await this._expertRepository.findExpertByEmail(email);
        return user;
    }

    async registerExpert(userData: IUserType): Promise<any> {
        if (userData.password) {
            const hashedPassword = await PasswordUtils.passwordHash(userData.password);
            userData.password = hashedPassword;
        }
        return await this._expertRepository.registerExpert(userData);
    }

    async resetPassword(email: string, password: string): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        return await this._expertRepository.resetPassword(email, hashedPassword);
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOtp = await this._expertRepository.storeOtp(email, otp);
        return storedOtp
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this._expertRepository.findOtp(email);
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        const resendOTP = await this._expertRepository.storeResendOtp(email, otp);
        return resendOTP;
    }

    async updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null> {
        const expertDetail = await this._expertRepository.updateDetails(expertDetails)
        return expertDetail
    }

    async getExpertById(id: string): Promise<IExpert | null> {
        const user = await this._expertRepository.getExpertById(id);
        return user;
    };

    async updateExpertById(id: string, updateData: Partial<IExpert>): Promise<IExpert | null> {
        const updatedExpert = await this._expertRepository.updateExpertById(id, updateData);
        return updatedExpert;
    };

    async getWalletById(id: string): Promise<IExpertWallet | null> {
        const wallet = await this._expertRepository.getWalletById(id);
        return wallet;
    };
}


export default ExpertService;