import logging
from flask import Flask, request, Response
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import requests
from collections import defaultdict, deque
import time
import re
from lib.URLMatcher import URLMatcher

import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
SERVER_URL = os.getenv("SERVER_URL")

client = MongoClient(MONGODB_URI, server_api=ServerApi("1"))

try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["test"]
endpoints = db["endpoints"]

app = Flask(__name__)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler("proxy_server.log"), logging.StreamHandler()],
)

# Rate limiting parameters
RATE_LIMIT = 10  # Number of requests allowed
WINDOW_SIZE = 60  # Window size in seconds

# 404 rate limiting parameters
MAX_404 = 3  # Maximum allowed 404 responses per IP per minute
REQUEST_TIMEOUT = 60  # Time in seconds to reset 404 count

# Dictionary to track request timestamps for each IP
request_timestamps = defaultdict(deque)
not_found_timestamps = defaultdict(deque)
blocked_ips = set()

# Allowed IPs (for demonstration purposes, only allow local IPs)
ALLOWED_IPS = ["127.0.0.1", "::1"]

# XSS Filtering Pattern
XSS_PATTERN = re.compile(r"<.*?>")

# SQL Injection Filtering Pattern
SQLI_PATTERN = re.compile(
    r"(\'|\")|(--)|(;)|(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|ALTER|CREATE)\b)",
    re.IGNORECASE,
)


def rate_limited(ip):
    current_time = time.time()
    if ip not in request_timestamps:
        request_timestamps[ip] = deque()

    timestamps = request_timestamps[ip]

    # Remove timestamps older than the sliding window
    while timestamps and timestamps[0] < current_time - WINDOW_SIZE:
        timestamps.popleft()

    # Check if the rate limit is exceeded
    if len(timestamps) >= RATE_LIMIT:
        logging.warning(f"Rate limit exceeded for IP: {ip}")
        return True

    # Record the new request
    timestamps.append(current_time)
    return False


def not_found_limited(ip):
    current_time = time.time()
    if ip not in not_found_timestamps:
        not_found_timestamps[ip] = deque()

    timestamps = not_found_timestamps[ip]

    # Remove timestamps older than the sliding window
    while timestamps and timestamps[0] < current_time - REQUEST_TIMEOUT:
        timestamps.popleft()
    if ip in blocked_ips and not timestamps:
        blocked_ips.remove(ip)

    # Check if the 404 limit is exceeded
    if len(timestamps) >= MAX_404:
        blocked_ips.add(ip)  # Block all future requests from this IP
        logging.warning(f"Blocked IP: {ip} due to too many 404s")
        return True

    # Record the 404 response
    timestamps.append(current_time)
    return False


def is_valid_ip(ip):
    """Check if the IP address is allowed."""
    valid = ip in ALLOWED_IPS
    if not valid:
        logging.warning(f"Blocked request from invalid IP: {ip}")
    return valid


def sanitize_input(data):
    """Remove potentially harmful scripts (XSS) and SQL injection attempts."""
    sanitized_data = XSS_PATTERN.sub("", data)
    sanitized_data = SQLI_PATTERN.sub("", sanitized_data)
    return sanitized_data


@app.before_request
def filter_ip():
    """Filter out requests from non-allowed IPs."""
    client_ip = request.remote_addr
    if not is_valid_ip(client_ip):
        return Response("Forbidden: Invalid IP Address", status=403)


@app.before_request
def filter_xss_sql_injection():
    """Sanitize all incoming data to prevent XSS and SQL injection."""
    if request.data:
        sanitized_data = sanitize_input(request.data.decode("utf-8"))
        request._cached_data = sanitized_data.encode("utf-8")
    if request.args:
        sanitized_args = {k: sanitize_input(v) for k, v in request.args.items()}
        request.args = sanitized_args
    if request.form:
        sanitized_form = {k: sanitize_input(v) for k, v in request.form.items()}
        request.form = sanitized_form


@app.before_request
def filter_ip():
    """Filter out requests from blocked IPs."""
    client_ip = request.remote_addr
    if client_ip in blocked_ips:
        logging.warning(f"Blocked request from IP: {client_ip}")
        return Response(
            "Your IP has been blocked due to excessive 404 errors.", status=403
        )


@app.route("/", defaults={"url": ""}, methods=["GET", "POST"])
@app.route("/<path:url>", methods=["GET", "POST"])
def proxy(url):
    client_ip = request.remote_addr

    if rate_limited(client_ip):
        return Response("Rate limit exceeded. Try again later.", status=429)

    target_url = (
        f"http://localhost:5173/{url}"  # Forward to Node.js server running on port 5173
    )

    disabled_endpoints = endpoints.find({"enabled": False})
    disabled_endpoints_urls = []

    for endpoint in disabled_endpoints:
        if "path" in endpoint:
            disabled_endpoints_urls.append(endpoint["path"])

    matcher = URLMatcher(disabled_endpoints_urls)
    if matcher.checkMatch(url):
        return Response("This endpoint is disabled.", status=403)

    try:
        if request.method == "GET":
            logging.info(f"GET request to {target_url} from IP: {client_ip}")
            resp = requests.get(
                target_url,
                headers={key: value for key, value in request.headers if key != "Host"},
            )
        else:
            logging.info(f"POST request to {target_url} from IP: {client_ip}")
            resp = requests.post(
                target_url,
                data=request.form,
                headers={key: value for key, value in request.headers if key != "Host"},
            )
    except requests.RequestException as e:
        logging.error(f"Error during request to {target_url}: {e}")
        return Response(f"An error occurred", status=500)

    if resp.status_code == 404:
        if not_found_limited(client_ip):
            return Response(
                "Too many 404 errors. Your IP has been blocked.", status=403
            )
        logging.warning(f"404 Not Found: {target_url} for IP: {client_ip}")
        return "Not found", 404

    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = [
        (name, value)
        for (name, value) in resp.raw.headers.items()
        if name.lower() not in excluded_headers
    ]
    response = Response(resp.content, resp.status_code, headers)
    return response


if __name__ == "__main__":
    app.run(port=80)  # Proxy server listens on port 80
