import logging
from flask import Flask, request, Response
import requests
from collections import deque
import time
import re

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s', handlers=[
    logging.FileHandler("proxy_server.log"),
    logging.StreamHandler()
])

# Rate limiting parameters
RATE_LIMIT = 10  # Number of requests allowed
WINDOW_SIZE = 60  # Window size in seconds

# Dictionary to track request timestamps for each IP
request_timestamps = {}

# Allowed IPs (for demonstration purposes, only allow local IPs)
ALLOWED_IPS = ["127.0.0.1", "::1"]

# XSS Filtering Pattern
XSS_PATTERN = re.compile(r'<.*?>')

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

def is_valid_ip(ip):
    """Check if the IP address is allowed."""
    valid = ip in ALLOWED_IPS
    if not valid:
        logging.warning(f"Blocked request from invalid IP: {ip}")
    return valid

def sanitize_input(data):
    """Remove potentially harmful scripts (XSS)."""
    return XSS_PATTERN.sub("", data)

@app.before_request
def filter_ip():
    """Filter out requests from non-allowed IPs."""
    client_ip = request.remote_addr
    if not is_valid_ip(client_ip):
        return Response("Forbidden: Invalid IP Address", status=403)

@app.before_request
def filter_xss():
    """Sanitize all incoming data to prevent XSS."""
    if request.data:
        sanitized_data = sanitize_input(request.data.decode('utf-8'))
        request._cached_data = sanitized_data.encode('utf-8')
    if request.args:
        sanitized_args = {k: sanitize_input(v) for k, v in request.args.items()}
        request.args = sanitized_args
    if request.form:
        sanitized_form = {k: sanitize_input(v) for k, v in request.form.items()}
        request.form = sanitized_form

@app.route('/', defaults={'url': ''}, methods=['GET', 'POST'])
@app.route('/<path:url>', methods=['GET', 'POST'])
def proxy(url):
    client_ip = request.remote_addr

    if rate_limited(client_ip):
        return Response("Rate limit exceeded. Try again later.", status=429)

    target_url = f'http://localhost:5173/{url}'  # Forward to Node.js server running on port 5173

    try:
        if request.method == 'GET':
            logging.info(f"GET request to {target_url} from IP: {client_ip}")
            resp = requests.get(target_url, headers={key: value for key, value in request.headers if key != 'Host'})
        else:
            logging.info(f"POST request to {target_url} from IP: {client_ip}")
            resp = requests.post(target_url, data=request.form, headers={key: value for key, value in request.headers if key != 'Host'})
    except requests.RequestException as e:
        logging.error(f"Error during request to {target_url}: {e}")
        return Response(f"An error occurred: {e}", status=500)

    if resp.status_code == 404:
        logging.warning(f"404 Not Found: {target_url}")
        return 'Not found', 404

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response

if __name__ == '__main__':
    app.run(port=80)  # Proxy server listens on port 80
