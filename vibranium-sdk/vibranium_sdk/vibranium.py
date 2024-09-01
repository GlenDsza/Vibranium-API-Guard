import requests
import json
from openapi3 import OpenAPI
import logging

logging.basicConfig(level=logging.INFO)

class VibraniumSDK:
    def __init__(self, base_url):
        self.base_url = base_url
        self.openapi_url = f"{base_url}/openapi.json"

    def fetch_openapi_spec(self):
        """Fetches the OpenAPI specification from the FastAPI application."""
        try:
            # response = requests.get(self.openapi_url)
            response = requests.get("http://localhost:8000/openapi.json")
            response.raise_for_status()  # Raise an exception for HTTP errors
            # save the response to a file
            with open("openapi.json", "w") as f:
                f.write(json.dumps(response.json(), indent=4))
            return response.json()
        except requests.RequestException as e:
            logging.info(f"Error fetching OpenAPI spec: {e}")
            return None

    def validate_spec(self, spec):
        """Validates the OpenAPI specification against the OpenAPI schema."""
        api = OpenAPI(spec)
        
    def test_sql_injection(self, endpoint, payloads):
        for payload in payloads:
            response = requests.post(endpoint, json={'name': payload, 'price': 1.0})
        if "error" in response.text:
            print(f"{endpoint} \n ❌ SQL Injection Test Passed for payload: {payload} ")
        else:
            print(f"{endpoint} \n ✅ SQL Injection Test Failed for payload: {payload}")
            
    def test_xss(self, endpoint, payloads):
        for payload in payloads:
            response = requests.post(endpoint, json={'name': payload, 'price': 1.0})
            if "<script>" in response.text:
                print(f"{endpoint} \n ❌ XSS Test Passed for payload: {payload}")
            else:
                print(f"{endpoint} \n ✅ XSS Test Failed for payload: {payload}")

    def test_access_control(self, endpoint, headers):
        response = requests.get(endpoint, headers=headers)
        if response.status_code == 403:
            print(f"{endpoint} \n ✅ Broken Authentication Test Passed")
        else:
            print(f"{endpoint} \n ❌ Broken Authentication Test Failed")
    
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
        # Test SQL Injection
        sql_injection_payloads = ["' OR 1=1 --", "' OR 'a'='a"]
        self.test_sql_injection('http://localhost:8000/items/', sql_injection_payloads)

        # Test XSS
        xss_payloads = ["<script>alert('XSS')</script>", "<img src='x' onerror='alert(1)'>"]
        self.test_xss('http://localhost:8000/items/', xss_payloads)

        # Test Access Control
        admin_headers = {'Authorization': 'Bearer admin_token'}
        self.test_access_control('http://localhost:8000/items/', admin_headers)
    
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
