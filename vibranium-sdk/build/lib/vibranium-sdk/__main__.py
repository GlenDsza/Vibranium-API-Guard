import argparse
from openapi_test_sdk.sdk import OpenAPITestSDK

def main():
    parser = argparse.ArgumentParser(description="Run OpenAPI tests on a FastAPI app.")
    parser.add_argument(
        "base_url", 
        type=str, 
        help="The base URL of the FastAPI app (e.g., https://your-fastapi-app.com)"
    )
    args = parser.parse_args()

    sdk = OpenAPITestSDK(args.base_url)
    sdk.run()

if __name__ == "__main__":
    main()
