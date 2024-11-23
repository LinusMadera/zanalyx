from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import requests
from datetime import datetime, timedelta
import numpy as np

router = APIRouter()

def fetch_binance_data(url: str) -> Dict[str, Any]:
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from our sources")
    return response.json()

@router.get("/historical/{symbol}")
# https://developers.binance.com/docs/binance-spot-api-docs/rest-api/public-api-endpoints#uiklines
def get_historical_data(
    symbol: str,
    start_time: int | None = None,
    end_time: int | None = None
):
    symbol_map = {
        "bitcoin": "BTCUSDT",
        "ethereum": "ETHUSDT"
    }

    if symbol not in symbol_map:
        raise HTTPException(status_code=400, detail="Unsupported cryptocurrency")

    binance_symbol = symbol_map[symbol]

    # Use provided timestamps or default to last 4 years
    end_time = end_time or int(datetime.now().timestamp() * 1000)
    start_time = start_time or int((datetime.now() - timedelta(days=4*365)).timestamp() * 1000)

    # Calculate time difference in days
    time_diff_days = (end_time - start_time) / (1000 * 60 * 60 * 24)
    interval = "1d" if time_diff_days < 365 else "1w"

    url = f"https://api.binance.com/api/v3/klines?symbol={binance_symbol}&interval={interval}&startTime={start_time}&endTime={end_time}&limit=1000"

    klines = fetch_binance_data(url)

    prices = [[int(k[0]), float(k[4])] for k in klines]  # Using closing price
    volumes = [[int(k[0]), float(k[5])] for k in klines]

    return {
        "prices": prices,
        "total_volumes": volumes
    }

@router.get("/prices")
def get_current_prices():
    symbols = ["BTCUSDT", "ETHUSDT"]
    prices = {}

    for symbol in symbols:
        url = f"https://api.binance.com/api/v3/ticker/price?symbol={symbol}"
        data = fetch_binance_data(url)
        crypto_name = "bitcoin" if symbol == "BTCUSDT" else "ethereum"
        prices[crypto_name] = float(data["price"])

    return prices

def calculate_moving_average(prices: List[List[float]], window: int) -> List[float]:
    try:
        values = [float(price[1]) for price in prices]  # Ensure values are float
        ma = []
        for i in range(len(values)):
            if i < window - 1:
                ma.append(None)
            else:
                window_values = values[max(0, i-window+1):i+1]
                if window_values:
                    ma.append(sum(window_values) / len(window_values))
                else:
                    ma.append(None)
        return ma
    except Exception as e:
        print(f"Error in calculate_moving_average: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating moving average: {str(e)}"
        )

def calculate_volatility(prices: List[List[float]], window: int = 30) -> List[float]:
    try:
        if len(prices) < 2:
            return [None] * len(prices)

        returns = []
        volatility = [None] * window

        # Calculate returns
        for i in range(1, len(prices)):
            prev_price = float(prices[i-1][1])
            curr_price = float(prices[i][1])
            if prev_price != 0:
                returns.append((curr_price - prev_price) / prev_price)
            else:
                returns.append(0)

        # Calculate rolling volatility
        for i in range(window, len(prices)):
            window_returns = returns[max(0, i-window):i]
            if window_returns:
                vol = float(np.std(window_returns) * np.sqrt(252))
                volatility.append(vol)
            else:
                volatility.append(None)

        return volatility
    except Exception as e:
        print(f"Error in calculate_volatility: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating volatility: {str(e)}"
        )

@router.get("/advanced-metrics/{symbol}")
def get_advanced_metrics(
    symbol: str,
    start_time: int | None = None,
    end_time: int | None = None
):
    try:
        data = get_historical_data(symbol, start_time, end_time)
        prices = data["prices"]
        volumes = data["total_volumes"]

        if not prices:
            raise HTTPException(
                status_code=400,
                detail="No price data available"
            )

        # Calculate metrics
        ma50 = calculate_moving_average(prices, 50)
        ma200 = calculate_moving_average(prices, 200)
        volatility = calculate_volatility(prices)

        # Ensure all arrays have the same length as prices
        if len(ma50) != len(prices) or len(ma200) != len(prices) or len(volatility) != len(prices):
            raise HTTPException(
                status_code=500,
                detail="Calculation error: array length mismatch"
            )

        # Create result arrays with timestamps
        ma50_data = []
        ma200_data = []
        volatility_data = []

        for i in range(len(prices)):
            timestamp = prices[i][0]

            if ma50[i] is not None:
                ma50_data.append([timestamp, ma50[i]])
            if ma200[i] is not None:
                ma200_data.append([timestamp, ma200[i]])
            if volatility[i] is not None:
                volatility_data.append([timestamp, volatility[i]])

        return {
            "ma50": ma50_data,
            "ma200": ma200_data,
            "volatility": volatility_data,
            "volumes": volumes
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error calculating advanced metrics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating advanced metrics: {str(e)}"
        )