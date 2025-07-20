import { IOrder } from "../../model/user/orderSchema";

export function getOrderSuccessEmailTemplate(order: IOrder, customerName: string,
    // orderNumber: string,
    // orderTotal: string,
    // itemType: string,
    // itemTitle: string,
    // orderDate: string,
    // estimatedAccess: string = 'Immediate 
): string {
    const itemIcon = order.type === 'Course' ? '📚' : '💎';
    const accessText = order.type === 'Course' ? 'course access' : 'subscription activation';

    const itemHtml = `
        <div class="order-item">
            <span class="item-name">${itemIcon} ${order.title}</span>
            <span class="item-details">${order.type}</span>
        </div>
    `;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmed - TradeClub</title>
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
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 20px;
                padding: 0;
                box-shadow: 0 15px 40px rgba(16, 185, 129, 0.2);
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
                color: white;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .subtitle {
                color: #f0fff4;
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
                color: #059669;
                margin-bottom: 25px;
                text-align: center;
            }
            
            .success-badge {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                text-align: center;
                font-weight: bold;
                font-size: 18px;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            }
            
            .main-text {
                font-size: 16px;
                margin-bottom: 25px;
                line-height: 1.7;
            }
            
            .order-summary {
                background: #f7fafc;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #10b981;
            }
            
            .order-title {
                font-size: 20px;
                font-weight: bold;
                color: #059669;
                margin-bottom: 15px;
            }
            
            .order-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .order-info strong {
                color: #2d3748;
            }
            
            .order-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .item-name {
                font-weight: 500;
                color: #2d3748;
            }
            
            .item-details {
                color: #718096;
                font-size: 14px;
            }
            
            .total-section {
                background: #e6fffa;
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                text-align: right;
            }
            
            .total-amount {
                font-size: 24px;
                font-weight: bold;
                color: #059669;
            }
            
            .delivery-info {
                background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                text-align: center;
            }
            
            .delivery-title {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
            }
            
            .delivery-date {
                font-size: 20px;
                font-weight: bold;
                color: #1d4ed8;
                margin-top: 10px;
            }
            
            .tracking-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                transition: transform 0.2s ease;
            }
            
            .tracking-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
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
                color: #10b981;
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
                
                .order-info {
                    flex-direction: column;
                    gap: 5px;
                }
                
                .order-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TradeClub</div>
                <div class="subtitle">Order Confirmation</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Thank you, ${customerName}! 🎉
                </div>
                
                <div class="success-badge">
                    ✅ ORDER CONFIRMED
                </div>
                
                <div class="main-text">
                    Your ${order.type.toLowerCase()} purchase has been successfully completed and is ready for access. ${order.type === 'Course' ? 'You can now start learning immediately!' : 'Your subscription benefits are now active!'}
                </div>
                
                <div class="order-summary">
                    <div class="order-title">📋 Order Summary</div>
                    <div class="order-info">
                        <span><strong>Order Number:</strong></span>
                        <span><strong>${order._id}</strong></span>
                    </div>
                    <div class="order-info">
                        <span><strong>Order Date:</strong></span>
                        <span><strong>${order.createdAt}</strong></span>
                    </div>
                    ${itemHtml}
                    <div class="total-section">
                        <div>Total Amount</div>
                        <div class="total-amount">${order.amount}</div>
                    </div>
                </div>
                
                <div class="delivery-info">
                    <div class="delivery-title">⚡ ${accessText.charAt(0).toUpperCase() + accessText.slice(1)}</div>
                    <div>Your ${order.type.toLowerCase()} will be activated:</div>
                </div>
                
                <div style="text-align: center;">
                    <a href="#" class="tracking-button">Access Your ${order.type}</a>
                </div>
                
                <div class="support-section">
                    <div class="support-title">💬 Need Help?</div>
                    <div>If you have any questions about your ${order.type.toLowerCase()} or need assistance accessing your content, please contact our support team at <strong>orders@tradeclub.com</strong> or call us at <strong>1-800-TRADE-CLUB</strong>.</div>
                </div>
                
                <div class="main-text">
                    We appreciate your business and look forward to serving you again soon!
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <strong>Best regards,</strong><br>
                    <strong style="color: #059669;">The TradeClub Team</strong>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    © 2025 TradeClub. All rights reserved.
                </div>
                <div class="footer-text">
                    Order #${order._id} | Need help? Visit our support center.
                </div>
                <div class="social-links">
                    <a href="#" class="social-link">Access Content</a>
                    <a href="#" class="social-link">Help Center</a>
                    <a href="#" class="social-link">Contact Us</a>
                </div>
            </div>
        </div>
    </body>
    </html> `;
};
