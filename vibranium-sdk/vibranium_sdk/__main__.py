import argparse
from vibranium_sdk.vibranium import VibraniumSDK
from vibranium_sdk.linter import Linter
import pyfiglet
import asyncio

ascii_banner = pyfiglet.figlet_format("Vibranium")
print(ascii_banner)

def main():
    parser = argparse.ArgumentParser(description="Run OpenAPI tests on a FastAPI app.")
    # Create subparsers for subcommands
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Subcommand for `run`
    run_parser = subparsers.add_parser("run", help="Run tests on FastAPI app")
    run_parser.add_argument("base_url", type=str, help="The base URL of the FastAPI app (e.g., https://your-fastapi-app.com)")

    # Subcommand for `lint`
    lint_parser = subparsers.add_parser("lint", help="Lint the OpenAPI specification")
    lint_parser.add_argument("base_url", type=str, help="Path to the OpenAPI specification file (YAML/JSON)")

    args = parser.parse_args()
    if args.command == "run":
        sdk = VibraniumSDK(args.base_url)
        sdk.run()
    elif args.command == "lint":
        linter = Linter(args.base_url)
        linter.run()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
