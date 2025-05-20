import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import { getOtpHtmlTemplate } from './otpTemplate';


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
            let res = await transporter.sendMail(mailOptions);
            return { message: "mail sent successfully" };
        } catch (error) {
            throw new Error('Failed to send OTP email');
        }
    }

}
export default MailUtility;