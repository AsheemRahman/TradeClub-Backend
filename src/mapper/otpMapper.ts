
import { OTPType } from "../model/user/otp";

import { OtpResponseDTO, CreateOtpDTO } from "../dto/otpDTO";
import { Types } from "mongoose";


export class OtpMapper {

    static toResponseDTO(otp: OTPType): OtpResponseDTO {
        return {
            id: (otp._id as Types.ObjectId).toString(),
            email: otp.email,
            otp: Number(otp.otp),
            createdAt: otp.createdAt!,
        };
    }

    static toEntity(dto: CreateOtpDTO): Partial<OTPType> {
        return {
            email: dto.email,
            otp: dto.otp.toString(),
        };
    }
}
