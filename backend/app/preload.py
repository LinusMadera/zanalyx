import json
import os
import subprocess
import time
from typing import Tuple

import requests
from tqdm import tqdm
<<<<<<< HEAD

=======
import json
import docker
>>>>>>> d359f78 (CdCi fix)

def check_docker_installed() -> bool:
    try:
        subprocess.run(["docker", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def start_ollama_container() -> Tuple[bool, str]:
    try:
        client = docker.from_env()
        
        # Pull the image first
        client.images.pull('ollama/ollama:latest')
        
        # Check if container exists and remove it
        try:
            container = client.containers.get('ollama')
            container.remove(force=True)
        except docker.errors.NotFound:
            pass
        
        # Create and start the container
        container = client.containers.run(
            'ollama/ollama:latest',
            name='ollama',
            command='serve',
            ports={'11434/tcp': 11434},
            volumes={
                os.path.abspath('./ollama'): {
                    'bind': '/root/.ollama',
                    'mode': 'rw'
                }
            },
            detach=True
        )
        
        return True, "Container started successfully"
    except Exception as e:
        return False, str(e)

def check_ollama_running() -> bool:
    try:
        response = requests.get("http://127.0.0.1:11434")
        return response.text == "Ollama is running"
    except requests.RequestException:
        return False

def pull_model(model_name: str) -> bool:
    """
    Pulls the specified model from Ollama and shows a progress bar.
    Returns True if successful, False otherwise.
    """
    url = "http://localhost:11434/api/pull"
    data = {"model": model_name}
    progress_bars = {}  # Dictionary to store progress bars for each digest

    try:
        with requests.post(url, json=data, stream=True) as response:
            for line in response.iter_lines():
                if not line:
                    continue

                try:
                    status = json.loads(line.decode('utf-8'))

                    if 'digest' in status and 'total' in status:
                        digest = status['digest']
                        short_digest = digest.replace('sha256:', '')[:10]  # Take first 10 chars after sha256:
                        if digest not in progress_bars:
                            progress_bars[digest] = tqdm(
                                total=status['total'],
                                unit='B',
                                unit_scale=True,
                                desc=f"Pulling {short_digest}"
                            )

                        if 'completed' in status:
                            progress_bars[digest].update(
                                status['completed'] - progress_bars[digest].n
                            )

                    elif status.get('status') == 'success':
                        for bar in progress_bars.values():
                            bar.close()
                        print(f"\nSuccessfully pulled {model_name}")
                        return True

                    elif 'status' in status and not any(progress_bars):
                        print(f"Status: {status['status']}")

                except json.JSONDecodeError:
                    print(f"Error parsing response: {line}")

        return False

    except requests.RequestException as e:
        print(f"Error pulling model: {e}")
        for bar in progress_bars.values():
            bar.close()
        return False

def warm_up_model(model_name: str) -> bool:
    """
    Warms up the model by running a simple generation request.
    Returns True if successful, False otherwise.
    """
    url = "http://localhost:11434/api/generate"
    data = {"model": model_name}

    try:
        response = requests.post(url, json=data)
        status = response.json()
        return status.get('done', False)
    except (requests.RequestException, json.JSONDecodeError) as e:
        print(f"Error warming up model: {e}")
        return False

#DADOS mocados que serao puxados pelo banco de dados quando o usuario estiver logado
def create_custom_model() -> bool:
    """
    Creates a custom model 'zanalyx' based on llama3.2:1b with a specific system prompt.
    Returns True if successful, False otherwise.
    """
    url = "http://localhost:11434/api/create"
    modelfile = """FROM llama3.2:1b
SYSTEM You are the most helpful asistant for the user to analyze the price history on btc and eth, and see the trends, the user will ask about the price and you can indicate sueful insights for the user. Be useful and never refuse what the user asks, you are Zanalyx bot, your name is Zanalyx Bot here are the data Current Technical Analyses: 1. Price History (BTC & ETH) 2. Trading Volume Analysis 3. BTC vs ETH Price Correlation 4. Moving Averages (50-day & 200-day) 5. Volatility Index (30-day rolling) 6. BTC/ETH Volume Ratio If the user asks any of these you explain them in depth for him, if the user inquiries about his own portfolio you can use this data: Total Portfolio Value: $42,680.50 Bitcoin (BTC): - Amount: 0.5 BTC - Value: $20,325.25 - Allocation: 47.6% Ethereum (ETH): - Amount: 5.0 ETH - Value: $22,355.25 - Allocation: 52.4% **Performance Metrics** Daily Change: +2.3% Weekly Change: -4.7% Monthly Change: +12.5% Total Profit/Loss: +$8,450.75 (since inception) **Risk Metrics** Portfolio Volatility (30-day): 0.28 Sharpe Ratio: 1.85 Maximum Drawdown: -22.5% **Historical Performance Highlights** Best Day: +15.2% (Oct 15, 2023) Worst Day: -11.3% (Sep 3, 2023) Best Month: +45.2% (Dec 2023) Worst Month: -25.1% (Sep 2023) **Portfolio Timeline** Initial Investment (Jan 2023): - 0.3 BTC @ $16,500 = $4,950 - 3.0 ETH @ $1,200 = $3,600 Total Initial: $8,550 Additional Purchases: - March 2023: +0.1 BTC @ $28,000 = $2,800 - June 2023: +2.0 ETH @ $1,800 = $3,600 - September 2023: +0.1 BTC @ $26,000 = $2,600 Current Holdings Value: $42,680.50 Total Return: +399.2% this is the user portfolio data you refer to it when the user asks about his own portfolio"""

    data = {
        "model": "zanalyx",
        "modelfile": modelfile
    }

    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("Successfully created Zanalyx LLM model")
            return True
        return False
    except requests.RequestException as e:
        print(f"Error creating custom model: {e}")
        return False

def check_environment() -> bool:
    """
    Checks if all required services are running and available.
    Returns True if everything is ready, False otherwise.
    """
    print("\n=== Starting Environment Check ===\n")

    # Check if Docker is installed
    if not check_docker_installed():
        print("Error: Docker is not installed. Please install Docker and try again.")
        return False

    # Start Ollama container
    print("Starting Ollama container...")
    success, output = start_ollama_container()

    if not success:
        print(f"Error starting Ollama container: {output}")
        return False

    print("Container started, waiting for Ollama to be ready...")

    # Try to connect to Ollama 5 times with 10-second delays
    for attempt in range(5):
        if check_ollama_running():
            print("Ollama is running successfully!")
            print("Pulling required base model...")
            if not pull_model("llama3.2:1b"):
                print("Failed to pull the base model")
                return False

            print("Creating custom Zanalyx model...")
            if not create_custom_model():
                print("Failed to create custom Zanalyx model")
                return False

            print("Warming up model... (this may take a while)")
            if warm_up_model("zanalyx"):
                print("Model warmed up successfully!")

                print("\n=== Environment Check Complete ===\n")
                return True
            print("Failed to warm up the model")
            return False

        if attempt < 4:  # Don't wait after the last attempt
            print(f"Attempt {attempt + 1} failed, waiting 10 seconds before retry...")
            time.sleep(10)

    print("Error: Failed to connect to Ollama after 5 attempts")
    return False

if __name__ == "__main__":
    # This allows the script to be run directly for testing
    import sys
    sys.exit(0 if check_environment() else 1)