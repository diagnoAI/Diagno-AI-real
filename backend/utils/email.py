import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")

def send_otp_email(email, otp):
    """Send OTP to user email"""
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = email
        msg["Subject"] = "Your OTP Code from DIAGNO AI"

        body = f"""
        Hello,

        Your OTP code for verifying your email is: {otp}.

        This OTP will expire in 10 minutes.

        Regards,
        DIAGNO AI Team
        Team Members:
        Sam, Mohamed Afridi, Abdul Kalam, Abdur Rahman.
        """
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, email, msg.as_string())

        print(f"OTP {otp} sent to {email}")
    except Exception as e:
        print("Error sending OTP email:", e)