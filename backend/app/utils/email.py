import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL")

def send_reset_password_email(to_email: str, reset_link: str):
    subject = "Password Reset Request"

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4a4a4a;">Password Reset Request</h2>
            <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
            <p>To reset your password, please click on the button below:</p>
            <p style="text-align: center;">
                <a href="{reset_link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <p>{reset_link}</p>
            <p>This link will expire in 3 hours.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have any concerns.</p>
            <p>Best regards,<br>Your Support Team</p>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(html_content, 'html'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Password reset email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise