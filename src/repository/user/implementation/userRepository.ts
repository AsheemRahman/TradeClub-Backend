import IUserRepository from "../IUserRepository";
import { User, IUser } from "../../../model/user/userSchema";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { IUserType } from "../../../types/IUser";
import { OTP, OTPType } from "../../../model/user/otp";

class userRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User)
    }

    async findUser(email: string): Promise<IUser | null> {
        const getUser = await User.findOne({ email: email });
        return getUser;
    }

    async registerUser(userData: IUserType): Promise<IUser | null> {
        const newUser = await User.create(userData);
        return newUser;
    }

    async resetPassword(email: string, hashedPassword: string): Promise<IUser | null> {
        const currentUser = await User.findOne({ email });
        if (!currentUser) return null;
        currentUser.password = hashedPassword;
        await currentUser.save();
        return currentUser;
    }

    async storeOtp(email: string, otp: number): Promise<OTPType | null> {
        const storedOTP = await OTP.create({ email, otp })
        return storedOTP;
    }

    async findOtp(email: string): Promise<OTPType | null> {
        const otp = await OTP.findOne({ email: email });
        return otp;
    }

    async storeResendOtp(email: string, otp: number): Promise<OTPType | null> {
        await OTP.findOneAndDelete({ email });
        const newOTP = await OTP.create({ email, otp });
        return newOTP;
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await User.findOne({ _id: id });
        return user;
    }
}

export default userRepository;