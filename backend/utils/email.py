import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")

def send_otp_email(email, otp, is_reset=False):
    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = email
        msg["Subject"] = "Your Password Reset OTP - Diagno AI" if is_reset else "Verify Your Email - Diagno AI"

        
        plain_text = f"""
Hello,

Your OTP code for {'resetting your password' if is_reset else 'verifying your email'} is: {otp}.

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

Regards,
Diagno AI Team
Team Members: Sam, Mohamed Afridi, Abdul Kalam, Abdur Rahman.
        """


        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{'Password Reset' if is_reset else 'Email Verification'} - Diagno AI</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background-color: #f4f7fb;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            padding: 0 20px;
        }}
        .card {{
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(to right, #2563eb, #06b6d4);
            padding: 20px;
            text-align: center;
        }}
        .header h1 {{
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
        }}
        .content {{
            padding: 30px;
            text-align: center;
        }}
        .otp {{
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 5px;
            margin: 20px 0;
            background: #eff6ff;
            padding: 15px;
            border-radius: 8px;
            display: inline-block;
        }}
        .message {{
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
            margin-bottom: 20px;
        }}
        .note {{
            font-size: 14px;
            color: #6b7280;
            margin-top: 20px;
        }}
        .footer {{
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }}
        .footer a {{
            color: #2563eb;
            text-decoration: none;
        }}
        .footer a:hover {{
            text-decoration: underline;
        }}
        @media (max-width: 600px) {{
            .container {{
                margin: 20px auto;
                padding: 0 10px;
            }}
            .content {{
                padding: 20px;
            }}
            .otp {{
                font-size: 24px;
                letter-spacing: 3px;
            }}
            .header h1 {{
                font-size: 28px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>DIAGNO AI</h1>
            </div>
            <div class="content">
                <h1>{'Reset Your Password' if is_reset else 'Verify Your Email'}</h1>
                <p class="message">
                    Hello,<br>
                    {'Please use the OTP below to reset your password.' if is_reset else 'Thank you for joining Diagno AI. Please use the OTP below to verify your email address.'}
                </p>
                <div class="otp">{otp}</div>
                <p class="message">
                    This OTP will expire in <strong>10 minutes</strong>.
                </p>
                <p class="note">
                    If you did not request this, please ignore this email or contact our support team.
                </p>
            </div>
            <div class="footer">
                <p>Regards,<br>Diagno AI Team<br>Team Members: Sam, Mohamed Afridi, Abdul Kalam, Abdur Rahman.</p>
                <p><a href="http://localhost:5173">diagno-ai.com</a> | <a href="mailto:support@diagno-ai.com">support@diagno-ai.com</a></p>
            </div>
        </div>
    </div>
</body>
</html>
        """

        
        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, email, msg.as_string())

        print(f"OTP {otp} sent to {email} for {'password reset' if is_reset else 'signup'}")
    except Exception as e:
        print("Error sending OTP email:", e)