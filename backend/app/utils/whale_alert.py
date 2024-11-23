import asyncio
import websockets
import json
from config import WHALE_ALERT_API_KEY
from database import get_db
from models.whale_alert import WhaleAlert

async def connect_whale_alert():
    url = f"wss://leviathan.whale-alert.io/ws?api_key={WHALE_ALERT_API_KEY}"

    subscription_msg = {
        "type": "subscribe_alerts",
        "blockchains": ["ethereum", "bitcoin", "dogecoin", "tron", "bitcoin_cash", "litecoin", "algorand", "polygon", "solana", "ripple"],
        "symbols": [
                    "BAT", "NEXO", "WETH", "GNO", "ILV", "CHSB", "ETH", "LINK", "SNX", "RPL", "IOTX", "COMP",
                    "ENS", "AXS", "INCH", "GRT", "SUSHI", "KCS", "AMP", "FTT",
                    "CHZ", "CRV", "MATIC", "THETA", "GALA", "USDT", "USDC", "BTC", "DOGE", "ALGO", "SOL", "XRP"
                ],
        "min_value_usd": 500_000,
    }


    while True:
        try:
            async with websockets.connect(url) as ws:
                await ws.send(json.dumps(subscription_msg))
                response = await ws.recv()
                print(f"Connected to Whale Alert: {response}")

                while True:
                    try:
                        message = await asyncio.wait_for(ws.recv(), timeout=20)
                        alert_data = json.loads(message)
                        await save_whale_alert(alert_data)
                    except asyncio.TimeoutError:
                        print('Timeout error, reconnecting...')
                        break
                    except websockets.ConnectionClosed:
                        print('Connection closed, reconnecting...')
                        break
        except Exception as e:
            print(f"Error connecting to Whale Alert: {e}")
            await asyncio.sleep(5)  # Wait for 5 seconds before trying to reconnect

async def save_whale_alert(alert_data):
    db = get_db()
    whale_alert = WhaleAlert(
        channel_id=alert_data.get('channel_id'),
        timestamp=alert_data.get('timestamp'),
        blockchain=alert_data.get('blockchain'),
        transaction_type=alert_data.get('transaction_type'),
        from_address=alert_data.get('from'),
        to_address=alert_data.get('to'),
        amounts=alert_data.get('amounts'),
        text=alert_data.get('text'),
        transaction=alert_data.get('transaction')
    )
    result = db.whale_alerts.insert_one(whale_alert.dict())
    print(f"Saved Whale Alert with ID: {result.inserted_id}")