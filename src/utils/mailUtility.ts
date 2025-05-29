import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import { getOtpHtmlTemplate } from './otpTemplate';
import { getRejectionEmailTemplate } from './rejectionTemplate';
import { getApprovalEmailTemplate } from './approvalTemplate';


dotenv.config()


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});


class MailUtility {
    static async sendMail(email: string, otp: number, subject: string): Promise<{ message: string }> {
        if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
            throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD  in environment variables");
        }
        const htmlContent = getOtpHtmlTemplate(otp, subject);

        const mailOptions = {
            from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject,
            html: htmlContent
        };

        try {
            await transporter.sendMail(mailOptions);
            return { message: "mail sent successfully" };
        } catch (error) {
            throw new Error('Failed to send OTP email');
        }
    }

    static async sendRejectionMail(email: string, expertName: string, rejectionReason: string, subject: string): Promise<{ message: string }> {
        if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
            throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD in environment variables");
        }
        const htmlContent = getRejectionEmailTemplate(expertName, rejectionReason);

        const mailOptions = {
            from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject,
            html: htmlContent
        };

        try {
            await transporter.sendMail(mailOptions);
            return { message: "Rejection email sent successfully" };
        } catch (error) {
            console.error("Failed to send rejection email:", error);
            throw new Error('Failed to send rejection email');
        }
    }

    static async sendApprovalMail( email: string, expertName: string, subject: string): Promise<{ message: string }> {
        if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
            throw new Error("Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD in environment variables");
        }
        const htmlContent = getApprovalEmailTemplate(expertName);

        const mailOptions = {
            from: `TradeClub <${process.env.NODEMAILER_EMAIL}>`,
            to: email,
            subject,
            html: htmlContent
        };

        try {
            await transporter.sendMail(mailOptions);
            return { message: "Approval email sent successfully" };
        } catch (error) {
            console.error("Failed to send approval email:", error);
            throw new Error('Failed to send approval email');
        }
    }
}
export default MailUtility;