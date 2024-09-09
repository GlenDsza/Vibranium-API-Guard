import logging
import re
from collections import defaultdict, deque
import time

# Rate limiting parameters
RATE_LIMIT = 10  # Number of requests allowed
WINDOW_SIZE = 60  # Window size in seconds

# Dictionary to track request timestamps for each IP
request_timestamps = defaultdict(deque)


class Protector:

    MANUAL_BLOCKED_IPS: set

    # XSS Filtering Pattern
    XSS_PATTERN = re.compile(r"<.*?>")

    # SQL Injection Filtering Pattern
    SQLI_PATTERN = re.compile(
        r"(\'|\")|(--)|(;)|(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|ALTER|CREATE)\b)",
        re.IGNORECASE,
    )

    def __init__(self, blocked_ips: list = []) -> None:

        self.MANUAL_BLOCKED_IPS = set(blocked_ips)

    def is_valid_ip(self, ip, db):
        """Check if the IP address is allowed."""

        org = db["organizations"].find_one({"name": "Flipkart"})
        if org and "blockedIps" in org:
            self.MANUAL_BLOCKED_IPS = set(org["blockedIps"])

        # Check if the IP is in the manual block list
        valid = ip not in self.MANUAL_BLOCKED_IPS
        if not valid:
            logging.warning(f"Blocked request from invalid IP: {ip}")
        return valid

    def sanitize_input(self, data):
        """Remove potentially harmful scripts (XSS) and SQL injection attempts."""
        sanitized_data = self.XSS_PATTERN.sub("", data)
        sanitized_data = self.SQLI_PATTERN.sub("", sanitized_data)
        return sanitized_data


class NotFoundLimiter:
    # 404 rate limiting parameters
    MAX_404: int  # Maximum allowed 404 responses per IP per minute
    REQUEST_TIMEOUT: int  # Time in seconds to reset 404 count

    not_found_timestamps: defaultdict[str, deque]
    blocked_ips: set

    def __init__(self, max_404=3, request_timeout=60):
        self.not_found_timestamps = defaultdict(deque)
        self.blocked_ips = set()
        self.MAX_404 = max_404
        self.REQUEST_TIMEOUT = request_timeout

    def add_not_found_limited(self, ip):
        current_time = time.time()
        if ip not in self.not_found_timestamps:
            self.not_found_timestamps[ip] = deque()

        timestamps = self.not_found_timestamps[ip]

        # Remove timestamps older than the sliding window
        while timestamps and timestamps[0] < current_time - self.REQUEST_TIMEOUT:
            timestamps.popleft()
        if ip in self.blocked_ips and not timestamps:
            self.blocked_ips.remove(ip)

        # Check if the 404 limit is exceeded
        if len(timestamps) >= self.MAX_404:
            self.blocked_ips.add(ip)  # Block all future requests from this IP
            logging.warning(f"Blocked IP: {ip} due to too many 404s")
            return True

        # Record the 404 response
        timestamps.append(current_time)
        return False

    def find_not_found_limited(self, ip):
        return ip in self.blocked_ips


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
