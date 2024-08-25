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
    
    def test_open_redirect(self, url):
        """Test for Open Redirect vulnerabilities."""
        payload = "http://malicious-site.com"
        try:
            response = requests.get(url, params={"redirect": payload})
            if response.url.startswith(payload):
                return f"Open Redirect vulnerability found at {url}."
            return f"No Open Redirect vulnerability at {url}."
        except requests.RequestException as e:
            return f"Error testing Open Redirect at {url}: {e}"

    def test_sensitive_data_exposure(self, url):
        """Test for sensitive data exposure."""
        try:
            response = requests.get(url)
            if "Authorization" in response.headers or "X-API-KEY" in response.headers:
                return f"Sensitive data exposure found at {url}."
            return f"No Sensitive Data Exposure at {url}."
        except requests.RequestException as e:
            return f"Error testing Sensitive Data Exposure at {url}: {e}"

    def test_security_misconfiguration(self, url):
        """Test for security misconfigurations."""
        headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
        }
        try:
            response = requests.get(url)
            missing_headers = [header for header in headers if headers[header] not in response.headers.get(header, "")]
            if missing_headers:
                return f"Security Misconfiguration found at {url}. Missing headers: {', '.join(missing_headers)}"
            return f"No Security Misconfiguration at {url}."
        except requests.RequestException as e:
            return f"Error testing Security Misconfiguration at {url}: {e}"

    def test_insecure_deserialization(self, url):
        """Test for Insecure Deserialization vulnerabilities."""
        payload = '{"user": "admin", "role": "admin"}'  # Example payload
        try:
            response = requests.post(url, data=payload, headers={"Content-Type": "application/json"})
            if response.status_code == 200:
                return f"Insecure Deserialization vulnerability found at {url}."
            return f"No Insecure Deserialization vulnerability at {url}."
        except requests.RequestException as e:
            return f"Error testing Insecure Deserialization at {url}: {e}"

    def test_broken_access_control(self, url):
        """Test for Broken Access Control vulnerabilities."""
        try:
            response = requests.get(url)
            if response.status_code == 403:
                return f"Broken Access Control vulnerability found at {url}."
            return f"No Broken Access Control vulnerability at {url}."
        except requests.RequestException as e:
            return f"Error testing Broken Access Control at {url}: {e}"

    def perform_tests(self, spec):
        """Performs basic tests on the OpenAPI specification."""
        results = {
            "missing_descriptions": [],
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

        # Test 1: Check if all endpoints have descriptions
        for path, methods in spec.get('paths', {}).items():
            for method, details in methods.items():
                if 'description' not in details:
                    results["missing_descriptions"].append(f"{method.upper()} {path}")

        # Test SQL Injection, XSS, and other vulnerabilities on all endpoints
        for path, methods in spec.get('paths', {}).items():
            for method, details in methods.items():
                url = f"{self.base_url}{path}"
                if method.lower() == "post":  # Assuming POST endpoints are vulnerable
                    print(f"Testing SQL Injection on {url}...")
                    results["sql_injection_results"].append(self.test_sql_injection(url))
                print(f"Testing XSS on {url}...")
                results["xss_results"].append(self.test_xss(url))
                print(f"Testing Open Redirect on {url}...")
                results["open_redirect_results"].append(self.test_open_redirect(url))
                print(f"Testing Sensitive Data Exposure on {url}...")
                results["sensitive_data_exposure_results"].append(self.test_sensitive_data_exposure(url))
                print(f"Testing Security Misconfiguration on {url}...")
                results["security_misconfiguration_results"].append(self.test_security_misconfiguration(url))
                print(f"Testing Insecure Deserialization on {url}...")
                results["insecure_deserialization_results"].append(self.test_insecure_deserialization(url))
                print(f"Testing Broken Access Control on {url}...")
                results["broken_access_control_results"].append(self.test_broken_access_control(url))

        return results

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
            results = self.perform_tests(spec)
            # If you have any test results to report, you can use generate_report
            self.generate_report(results)

# Usage example
if __name__ == "__main__":
    sdk = VibraniumSDK("https://your-fastapi-app.com")
    sdk.run()
