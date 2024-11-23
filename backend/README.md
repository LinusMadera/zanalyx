# FastAPI Template

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up your .env file:
   ```
   MONGODB_URL = 'your_mongodb_connection_string'
   JWT_SECRET = 'your_jwt_secret'
   SOFTWARE_NAME = 'software_name'
   ```
4. Run the server:
   ```
   cd app
   python main.py
   ```

## Docs

Access swagger at `/swagger`, and redoc at `/redoc` after running the server.
