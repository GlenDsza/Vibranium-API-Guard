# VibraniumSDK

VibraniumSDK is a Python library designed for security testing of APIs based on OpenAPI specifications. It performs vulnerability tests for SQL Injection, XSS, and access control, and generates a detailed HTML report of the test results.

## Features

- **Fetch OpenAPI Specification**: Retrieves the OpenAPI JSON from a specified URL.
- **Validate Specification**: Ensures the OpenAPI specification is properly formatted (basic validation).
- **SQL Injection Testing**: Tests endpoints for SQL Injection vulnerabilities.
- **XSS Testing**: Tests endpoints for Cross-Site Scripting (XSS) vulnerabilities.
- **Access Control Testing**: Checks for proper access control by simulating authenticated and unauthorized requests.
- **Generate Report**: Creates an HTML report summarizing the results of the tests.

## Usage

```bash
vibranium-sdk http://somedomain.com/
```