import argparse
from vibranium_sdk.vibranium import VibraniumSDK
import pyfiglet

ascii_banner = pyfiglet.figlet_format("Vibranium")
print(ascii_banner)

def main():
    parser = argparse.ArgumentParser(description="Run OpenAPI tests on a FastAPI app.")
    parser.add_argument(
        "base_url", 
        type=str, 
        help="The base URL of the FastAPI app (e.g., https://your-fastapi-app.com)"
    )
    args = parser.parse_args()

    sdk = VibraniumSDK(args.base_url)
    sdk.run()

if __name__ == "__main__":
    main()
