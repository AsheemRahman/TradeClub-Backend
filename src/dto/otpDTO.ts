export interface CreateOtpDTO {
    email: string;
    otp: number;
}

export interface OtpResponseDTO {
    id: string;
    email: string;
    otp: number;
    createdAt: Date;
}