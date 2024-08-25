import requests
import json

class OpenAPITestSDK:
    def __init__(self, base_url):
        self.base_url = base_url
        self.openapi_url = f"{base_url}/openapi.json"

    def fetch_openapi_spec(self):
        """Fetches the OpenAPI specification from the FastAPI application."""
        try:
            response = requests.get(self.openapi_url)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching OpenAPI spec: {e}")
            return None

    def validate_spec(self, spec):
        """Validates the OpenAPI specification against the OpenAPI schema."""
        # Basic validation: check if required fields are present
        if not isinstance(spec, dict):
            raise ValueError("Invalid OpenAPI specification format")

        required_fields = ['openapi', 'info', 'paths']
        for field in required_fields:
            if field not in spec:
                raise ValueError(f"Missing required field in OpenAPI spec: {field}")

    def perform_tests(self, spec):
        """Performs basic tests on the OpenAPI specification."""
        if not spec:
            print("No specification to test")
            return

        print("Running tests on the OpenAPI specification...")

        # Test 1: Check if all endpoints have descriptions
        missing_descriptions = []
        for path, methods in spec.get('paths', {}).items():
            for method, details in methods.items():
                if 'description' not in details:
                    missing_descriptions.append(f"{method.upper()} {path}")

        if missing_descriptions:
            print("Endpoints missing descriptions:")
            for item in missing_descriptions:
                print(f"- {item}")
        else:
            print("All endpoints have descriptions.")

        # You can add more tests as needed

    def generate_report(self, missing_descriptions):
        """Generates a report based on the results of the tests."""
        report = {
            "missing_descriptions": missing_descriptions,
            # Add other test results here
        }
        with open("test_report.json", "w") as report_file:
            json.dump(report, report_file, indent=4)
        print("Report generated: test_report.json")

    def run(self):
        """Main method to fetch the spec, perform tests, and generate a report."""
        spec = self.fetch_openapi_spec()
        if spec:
            self.validate_spec(spec)
            self.perform_tests(spec)
            # If you have any test results to report, you can use generate_report
            # self.generate_report(missing_descriptions)

# Usage example
if __name__ == "__main__":
    sdk = OpenAPITestSDK("https://your-fastapi-app.com")
    sdk.run()
