"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpHtmlTemplate = void 0;
const getOtpHtmlTemplate = (otp, subject) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg,rgb(233, 107, 44) 0%, #E54B00 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: 600;">TradeClub</h1>
          <p style="color: #232323; margin: 8px 0 0 0; font-size: 14px;">Secure Verification</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 48px 32px;">
          <h2 style="color: #1a202c; margin: 0 0 24px 0; font-size: 22px; font-weight: 600;">${subject}</h2>
          
          <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
            Hello there! We've received a request to verify your account. Use the verification code below to complete the process:
          </p>
          
          <!-- OTP Box -->
          <div style="background-color: #f7fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">Verification Code</p>
            <div style="font-size: 36px; font-weight: 700; color: #2d3748; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
          </div>
          
          <!-- Info Box -->
          <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <p style="color: #2c5282; margin: 0; font-size: 14px; font-weight: 500;">
              🔒 This code will expire in 10 minutes for your security
            </p>
          </div>
          
          <p style="color: #4a5568; margin: 24px 0 0 0; font-size: 16px; line-height: 1.6;">
            If you didn't request this code, please ignore this email or contact our support team if you're concerned about your account security.
          </p>
          
          <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; margin: 0; font-size: 14px;">
              Best regards,<br>
              <strong style="color: #2d3748;">The TradeClub Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f7fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center;">
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            © 2025 TradeClub. All rights reserved.
          </p>
          <p style="color: #a0aec0; margin: 4px 0 0 0; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.getOtpHtmlTemplate = getOtpHtmlTemplate;
