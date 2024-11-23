import os

from dotenv import load_dotenv

# Load the .env file
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
SOFTWARE_NAME = os.getenv("SOFTWARE_NAME")
JWT_ALGORITHM = "HS256"
MERCADO_PAGO_ACCESS_TOKEN = os.getenv("MERCADO_PAGO_ACCESS_TOKEN")
MERCADO_PAGO_PUBLIC_KEY = os.getenv("MERCADO_PAGO_PUBLIC_KEY")
WHALE_ALERT_API_KEY = os.getenv("WHALE_ALERT_API_KEY")