import requests
import json
import logging
from tabulate import tabulate

logging.basicConfig(level=logging.INFO)

class Linter:
    def __init__(self, base_url):
        self.base_url = base_url
        self.openapi_url = f"{base_url}/openapi.json"
        self.api_spec = self.fetch_openapi_spec()

    def fetch_openapi_spec(self):
        """Fetches the OpenAPI specification from the FastAPI application."""
        try:
            response = requests.get(self.openapi_url)
            # response = requests.get("http://localhost:8000/openapi.json")
            response.raise_for_status()  # Raise an exception for HTTP errors
            # save the response to a file
            with open("openapi.json", "w") as f:
                f.write(json.dumps(response.json(), indent=4))
            return response.json()
        except requests.RequestException as e:
            logging.info(f"Error fetching OpenAPI spec: {e}")
            return None
        
    def lint(self):
        data = {
            "spec": self.api_spec 
        }
        response = requests.post("http://localhost:4000/api/lint/linter", json=data)
        
        # Log the response
        table_data = []
        for issue in response.json():
            path = " > ".join(issue["path"])
        
            # Trim the path if it's too long
            if len(path) > 20:
                path = "..." + path[-(20 - 3):]
            message = issue["message"]
            line = issue["range"]["start"]["line"]
            issue_type = issue["code"]
            severity = issue["severity"]
            table_data.append([path, severity, line, message])
            
        # Print the table
        headers = ["Path", "Severity", "Line", "Message"]
        print(tabulate(table_data, headers, tablefmt="grid"))

    def run(self):
        self.lint()