import IexpertRepository from "../IExpertRepository";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { IUserType } from "../../../types/IUser";
import { OTP, OTPType } from "../../../model/user/otp";
import { Expert, IExpert } from "../../../model/expert/expertSchema";
import { ExpertFormData } from "../../../types/IExpert";

class expertRepository extends BaseRepository<IExpert> implements IexpertRepository {
    constructor() {
        super(Expert)
    }

    async findExpertByEmail(email: string): Promise<IExpert | null> {
        const getUser = await Expert.findOne({ email: email });
        return getUser;
    }

    async registerExpert(userData: IUserType): Promise<IExpert | null> {
        const newUser = await Expert.create(userData);
        return newUser;
    }

    async resetPassword(email: string, hashedPassword: string): Promise<IExpert | null> {
        const currentUser = await Expert.findOne({ email });
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

    async updateDetails(expertDetails: ExpertFormData): Promise<IExpert | null> {
        const { email, ...updateData } = expertDetails;
        console.log(email)
        console.log(updateData)
        const updatedExpert = await Expert.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
        return updatedExpert;
    }
}

export default expertRepository;