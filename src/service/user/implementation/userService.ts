
import IUserRepository from "../../../repository/user/IUserRepository";
import IUserService from "../IUserService";
import { IUserType } from '../../../types/IUser'


import PasswordUtils from "../../../utils/passwordUtils";
import { OTPType } from "../../../model/user/otp";
import { IUser } from "../../../model/user/userSchema";



class UserService implements IUserService {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async findUser(email: string): Promise<IUser | null> {
        const user = await this._userRepository.findUser(email);
        return user;
    }

    async registerUser(userData: IUserType): Promise<any> {
        const hashedPassword = await PasswordUtils.passwordHash(userData.password);
        const newUser = { ...userData, password: hashedPassword, };
        return await this._userRepository.registerUser(newUser);
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


export default UserService;