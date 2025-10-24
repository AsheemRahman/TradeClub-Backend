"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpMapper = void 0;
class OtpMapper {
    static toResponseDTO(otp) {
        return {
            id: otp._id.toString(),
            email: otp.email,
            otp: Number(otp.otp),
            createdAt: otp.createdAt,
        };
    }
    static toEntity(dto) {
        return {
            email: dto.email,
            otp: dto.otp.toString(),
        };
    }
}
exports.OtpMapper = OtpMapper;
