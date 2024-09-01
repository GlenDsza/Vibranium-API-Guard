import requests
import json

class VibraniumSDK:
    def __init__(self, base_url):
        self.base_url = base_url
        self.openapi_url = f"{base_url}/openapi.json"

    def fetch_openapi_spec(self):
        """Fetches the OpenAPI specification from the FastAPI application."""
        try:
            response = requests.get(self.openapi_url)
            response.raise_for_status()  # Raise an exception for HTTP errors
            # save the response to a file
            with open("openapi.json", "w") as f:
                f.write(json.dumps(response.json(), indent=4))
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

    def test_sql_injection(self, url):
        """Test for SQL Injection vulnerabilities."""
        payload = "' OR 1=1 --"
        try:
            response = requests.post(url, data={"input": payload})
            if "SQL" in response.text or response.status_code == 500:
                return f"SQL Injection vulnerability found at {url}."
            return f"No SQL Injection vulnerability at {url}."
        except requests.RequestException as e:
            return f"Error testing SQL Injection at {url}: {e}"

    def test_xss(self, url):
        """Test for XSS vulnerabilities."""
        payload = "<script>alert('XSS')</script>"
        try:
            # Test with GET request
            print(url)
            response = requests.get(url, params={"query": payload})
            if payload in response.text:
                return f"Potential XSS vulnerability found at {url}."
            
            # Test with POST request, if applicable
            response = requests.post(url, data={"input": payload})
            if payload in response.text:
                return f"Potential XSS vulnerability found at {url}."
            
            return f"No XSS vulnerability detected at {url}."
        except requests.RequestException as e:
            return f"Error testing XSS at {url}: {e}"
    
    def perform_tests(self, spec):
        """Performs basic tests on the OpenAPI specification."""
        results = {
            "sql_injection_results": [],
            "xss_results": [],
            "open_redirect_results": [],
            "sensitive_data_exposure_results": [],
            "security_misconfiguration_results": [],
            "insecure_deserialization_results": [],
            "broken_access_control_results": []
        }

        if not spec:
            print("No specification to test")
            return results

        print("Running tests on the OpenAPI specification...")

        # Test SQL Injection, XSS, and other vulnerabilities on all endpoints
        for path, methods in spec.get('paths', {}).items():
            for method, details in methods.items():
                url = f"{self.base_url}{path}"
                if method.lower() == "post":  # Assuming POST endpoints are vulnerable
                    print(f"Testing SQL Injection on {url}...")
                    results["sql_injection_results"].append(self.test_sql_injection(url))
                print(f"Testing XSS on {url}...")
                results["xss_results"].append(self.test_xss(url))
        return results

    def generate_report(self, results):
        """Generates a report based on the results of the tests."""
        report = results
        # create HTML
        with open("test_report.html", "w") as report_file:
            report_file.write("<html><head><title>Test Report</title></head><body>")
            for category, tests in report.items():
                report_file.write(f"<h2>{category.replace('_', ' ').title()}</h2>")
                if not tests:
                    report_file.write("<p>No issues found.</p>")
                else:
                    report_file.write("<ul>")
                    for test in tests:
                        report_file.write(f"<li>{test}</li>")
                    report_file.write("</ul>")
            report_file.write("</body></html>")

    def run(self):
        """Main method to fetch the spec, perform tests, and generate a report."""
        spec = self.fetch_openapi_spec()
        if spec:
            self.validate_spec(spec)
            results = self.perform_tests(spec)
            # If you have any test results to report, you can use generate_report
            self.generate_report(results)

# Usage example
if __name__ == "__main__":
    sdk = VibraniumSDK("https://your-fastapi-app.com")
    sdk.run()
