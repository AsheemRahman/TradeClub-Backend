"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRejectionEmailTemplate = getRejectionEmailTemplate;
function getRejectionEmailTemplate(expertName, rejectionReason) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Status - TradeClub</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                padding: 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                text-align: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: white;
                margin-bottom: 10px;
            }
            .subtitle {
                color: rgba(255,255,255,0.8);
                font-size: 16px;
            }
            .content {
                padding: 40px 30px;
                background: white;
                margin: 0;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #2c3e50;
            }
            .message {
                background: #fff5f5;
                border-left: 4px solid #f56565;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            .reason-box {
                background: #f7fafc;
                border: 1px solid #e2e8f0;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .reason-title {
                font-weight: bold;
                color: #2d3748;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .reason-text {
                color: #4a5568;
                line-height: 1.6;
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 3px solid #f56565;
            }
            .next-steps {
                background: #f0fff4;
                border: 1px solid #9ae6b4;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background: #2d3748;
                color: white;
                padding: 30px;
                text-align: center;
            }
            .footer-links {
                margin: 20px 0;
            }
            .footer-links a {
                color: #81e6d9;
                text-decoration: none;
                margin: 0 15px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #81e6d9;
                text-decoration: none;
            }
            @media (max-width: 600px) {
                body {
                    padding: 10px;
                }
                .content {
                    padding: 20px 15px;
                }
                .header {
                    padding: 20px 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TradeClub</div>
                <div class="subtitle">Expert Trading Platform</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Dear ${expertName},
                </div>
                
                <p>Thank you for your interest in becoming a trading expert on TradeClub. We appreciate the time and effort you invested in your application.</p>
                
                <div class="message">
                    <strong>Application Status: Not Approved</strong>
                    <p>After careful review of your application, we have decided not to approve your expert application at this time.</p>
                </div>
                
                <div class="reason-box">
                    <div class="reason-title">📋 Reason for Decision:</div>
                    <div class="reason-text">
                        ${rejectionReason}
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3 style="color: #2d3748; margin-top: 0;">🚀 What's Next?</h3>
                    <p><strong>Don't lose hope!</strong> You can address the concerns mentioned above and reapply in the future.</p>
                    <ul style="color: #4a5568;">
                        <li>Review the feedback provided</li>
                        <li>Improve your application materials</li>
                        <li>Gain additional experience if needed</li>
                        <li>Resubmit your application when ready</li>
                    </ul>
                </div>
                
                <p>If you have any questions about this decision or need clarification on how to improve your application, please don't hesitate to contact our support team.</p>
                
                <center>
                    <a href="mailto:support@tradeclub.com" class="cta-button">Contact Support</a>
                </center>
                
                <p>We encourage you to continue developing your trading expertise and consider reapplying in the future.</p>
                
                <p>Best regards,<br>
                <strong>The TradeClub Team</strong></p>
            </div>
            
            <div class="footer">
                <div class="footer-links">
                    <a href="#">About Us</a>
                    <a href="#">Expert Guidelines</a>
                    <a href="#">Support</a>
                    <a href="#">Contact</a>
                </div>
                
                <div class="social-links">
                    <a href="#">LinkedIn</a>
                    <a href="#">Twitter</a>
                    <a href="#">Facebook</a>
                </div>
                
                <p style="margin: 20px 0 0 0; font-size: 12px; color: #a0aec0;">
                    © 2024 TradeClub. All rights reserved.<br>
                    This email was sent to ${expertName} regarding your expert application.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}
