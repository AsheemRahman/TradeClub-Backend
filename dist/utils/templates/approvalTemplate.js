"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApprovalEmailTemplate = getApprovalEmailTemplate;
function getApprovalEmailTemplate(expertName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Congratulations - TradeClub Expert Approved</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f0f8f4;
            }
            
            .container {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                border-radius: 20px;
                padding: 0;
                box-shadow: 0 15px 40px rgba(72, 187, 120, 0.2);
                overflow: hidden;
                position: relative;
            }
            
            .container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
            }
            
            .header {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                text-align: center;
                backdrop-filter: blur(10px);
            }
            
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: black;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgb(255, 244, 244);
            }
            
            .subtitle {
                color: #232323;
                font-size: 16px;
                font-weight: 500;
            }
            
            .content {
                background: white;
                padding: 40px 30px;
                color: #2d3748;
            }
            
            .greeting {
                font-size: 28px;
                font-weight: bold;
                color: #2f855a;
                margin-bottom: 25px;
                text-align: center;
            }
            
            .congratulations-badge {
                background: linear-gradient(135deg, #48bb78, #38a169);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                text-align: center;
                font-weight: bold;
                font-size: 18px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
            }
            
            .main-text {
                font-size: 16px;
                margin-bottom: 25px;
                line-height: 1.7;
            }
            
            .benefits-section {
                background: #f7fafc;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #48bb78;
            }
            
            .benefits-title {
                font-size: 20px;
                font-weight: bold;
                color: #2f855a;
                margin-bottom: 15px;
            }
            
            .benefit-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 15px;
            }
            
            .benefit-icon {
                color: #48bb78;
                margin-right: 10px;
                font-weight: bold;
            }
            
            .next-steps {
                background: linear-gradient(135deg, #e6fffa, #b2f5ea);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
            }
            
            .next-steps-title {
                font-size: 18px;
                font-weight: bold;
                color: #234e52;
                margin-bottom: 15px;
            }
            
            .step-item {
                margin-bottom: 10px;
                padding-left: 20px;
                position: relative;
                font-size: 15px;
            }
            
            .step-item::before {
                content: counter(step-counter);
                counter-increment: step-counter;
                position: absolute;
                left: 0;
                top: 0;
                background: #38a169;
                color: white;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            
            .next-steps {
                counter-reset: step-counter;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #48bb78, #38a169);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
                transition: transform 0.2s ease;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
            }
            
            .support-section {
                background: #fffbeb;
                border-radius: 12px;
                padding: 20px;
                margin: 25px 0;
                border: 1px solid #fed7aa;
                text-align: center;
            }
            
            .support-title {
                font-weight: bold;
                color: #9a3412;
                margin-bottom: 10px;
            }
            
            .footer {
                background: #2d3748;
                color: #e2e8f0;
                padding: 25px 30px;
                text-align: center;
            }
            
            .footer-text {
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-link {
                color: #48bb78;
                text-decoration: none;
                margin: 0 10px;
                font-weight: 500;
            }
            
            @media (max-width: 600px) {
                body {
                    padding: 10px;
                }
                
                .content {
                    padding: 25px 20px;
                }
                
                .greeting {
                    font-size: 24px;
                }
                
                .logo {
                    font-size: 28px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TradeClub</div>
                <div class="subtitle">Welcome to Our Expert Community!</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Congratulations ${expertName}! 🎉
                </div>
                
                <div class="congratulations-badge">
                    ✅ APPLICATION APPROVED
                </div>
                
                <div class="main-text">
                    We're thrilled to inform you that your application to become a trading expert on TradeClub has been <strong>approved</strong>! After careful review of your credentials and experience, we're confident you'll be a valuable addition to our expert community.
                </div>
                
                <div class="benefits-section">
                    <div class="benefits-title">🚀 What This Means for You:</div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        Access to our exclusive expert dashboard and tools
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        Ability to share trading insights and analysis
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        Connect with a community of professional traders
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        Earn recognition and build your trading reputation
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        Monetize your expertise through our platform
                    </div>
                </div>
                
                <div class="next-steps">
                    <div class="next-steps-title">📋 Next Steps:</div>
                    <div class="step-item">Complete your expert profile setup</div>
                    <div class="step-item">Set your availability</div>
                    <div class="step-item">Upload your professional photo and bio</div>
                    <div class="step-item">Start sharing your first market insights</div>
                </div>
                
                <div class="support-section">
                    <div class="support-title">💬 Need Help Getting Started?</div>
                    <div>Our support team is here to help! Reach out to us at <strong>experts@tradeclub.com</strong> or check out our comprehensive onboarding guide.</div>
                </div>
                
                <div class="main-text">
                    We're excited to see the valuable insights and expertise you'll bring to our trading community. Welcome aboard, and here's to your success on TradeClub!
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <strong>Best regards,</strong><br>
                    <strong style="color: #2f855a;">The TradeClub Team</strong>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    © 2025 TradeClub. All rights reserved.
                </div>
                <div class="footer-text">
                    This email was sent to you because you applied to become a TradeClub expert.
                </div>
                <div class="social-links">
                    <a href="#" class="social-link">Website</a>
                    <a href="#" class="social-link">Help Center</a>
                    <a href="#" class="social-link">Contact Us</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
