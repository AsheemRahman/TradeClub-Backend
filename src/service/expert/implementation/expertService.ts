
import IExpertRepository from "../../../repository/expert/IExpertRepository";
import IExpertService from "../IExpertService";
import { IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IExpert } from "../../../model/expert/expertSchema";



class ExpertService implements IExpertService {
    private _userRepository: IExpertRepository;

    constructor(userRepository: IExpertRepository) {
        this._userRepository = userRepository;
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        const user = await this._userRepository.findExpertByEmail(email);
        return user;
    }

    async registerExpert(userData: IUserType): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(userData.password);
        const newUser = { ...userData, password: hashedPassword, };
        return await this._userRepository.registerExpert(newUser);
    }

    async resetPassword(email: string, password: string): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(password);
        return await this._userRepository.resetPassword(email, hashedPassword);
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOtp = await this._userRepository.storeOtp(email, otp);
        return storedOtp
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await this._userRepository.findOtp(email);
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        const resendOTP = await this._userRepository.storeResendOtp(email, otp);
        return resendOTP;
    }
}


export default ExpertService;