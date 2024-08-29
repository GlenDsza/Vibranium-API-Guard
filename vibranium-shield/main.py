from flask import Flask, request, Response
import requests
from collections import deque
import time

app = Flask(__name__)

# Rate limiting parameters
RATE_LIMIT = 10  # Number of requests allowed
WINDOW_SIZE = 60  # Window size in seconds

# Dictionary to track request timestamps for each IP
request_timestamps = {}

def rate_limited(ip):
    current_time = time.time()
    if ip not in request_timestamps:
        request_timestamps[ip] = deque()

    timestamps = request_timestamps[ip]

    # Remove timestamps older than the sliding window
    while timestamps and timestamps[0] < current_time - WINDOW_SIZE:
        timestamps.popleft()

    # Check if the rate limit is exceeded
    print(timestamps)

    if len(timestamps) >= RATE_LIMIT:
        return True

    # Record the new request
    timestamps.append(current_time)
    return False

@app.route('/', defaults={'url': ''}, methods=['GET', 'POST'])
@app.route('/<path:url>', methods=['GET', 'POST'])
def proxy(url):
    client_ip = request.remote_addr

    if rate_limited(client_ip):
        return Response("Rate limit exceeded. Try again later.", status=429)

    target_url = f'http://localhost:5173/{url}'  # Forward to Node.js server running on port 3000

    try:
        if request.method == 'GET':
            resp = requests.get(target_url)
        else:
            resp = requests.post(target_url, data=request.form)
    except requests.RequestException as e:
        return Response(f"An error occurred: {e}", status=500)

    if resp.status_code == 404:
        return 'Not found', 404

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response

if __name__ == '__main__':
    app.run(port=80)  # Proxy server listens on port 80
