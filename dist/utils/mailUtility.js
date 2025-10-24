"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const otpTemplate_1 = require("./templates/otpTemplate");
const rejectionTemplate_1 = require("./templates/rejectionTemplate");
const approvalTemplate_1 = require("./templates/approvalTemplate");
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});
class MailUtility {
    static sendMail(email, otp, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
                throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD  in environment variables");
            }
            const htmlContent = (0, otpTemplate_1.getOtpHtmlTemplate)(otp, subject);
            const mailOptions = {
                from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject,
                html: htmlContent
            };
            try {
                yield transporter.sendMail(mailOptions);
                return { message: "mail sent successfully" };
            }
            catch (error) {
                throw new Error('Failed to send OTP email');
            }
        });
    }
    static sendRejectionMail(email, expertName, rejectionReason, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
                throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD in environment variables");
            }
            const htmlContent = (0, rejectionTemplate_1.getRejectionEmailTemplate)(expertName, rejectionReason);
            const mailOptions = {
                from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject,
                html: htmlContent
            };
            try {
                yield transporter.sendMail(mailOptions);
                return { message: "Rejection email sent successfully" };
            }
            catch (error) {
                console.error("Failed to send rejection email:", error);
                throw new Error('Failed to send rejection email');
            }
        });
    }
    static sendApprovalMail(email, expertName, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
                throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD in environment variables");
            }
            const htmlContent = (0, approvalTemplate_1.getApprovalEmailTemplate)(expertName);
            const mailOptions = {
                from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject,
                html: htmlContent
            };
            try {
                yield transporter.sendMail(mailOptions);
                return { message: "Approval email sent successfully" };
            }
            catch (error) {
                console.error("Failed to send approval email:", error);
                throw new Error('Failed to send approval email');
            }
        });
    }
}
exports.default = MailUtility;
