import logging
from time import time
from flask import Flask, json, request, Response
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import requests
from lib.Protector import rate_limited, Protector, NotFoundLimiter
from lib.URLMatcher import URLMatcher
from lib.TrafficManager import TrafficManager
import os
from dotenv import load_dotenv

load_dotenv()


# Initialize the database connection
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
org = db["organizations"].find_one({"name": "Flipkart"})

if org and "blockedIps" in org:
    protector = Protector(blocked_ips=org["blockedIps"])
else:
    protector = Protector()

app = Flask(__name__)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.FileHandler("proxy_server.log"), logging.StreamHandler()],
)

# Initialize the and 404 limiter
not_found_limiter = NotFoundLimiter()

# Initialize the traffic manager
traffic_manager = TrafficManager(db["traffic"])


@app.after_request
def log_traffic(response):
    traffic_manager.log_traffic(request, response)
    return response


@app.before_request
def filter_ip():
    """Filter out requests from non-allowed IPs."""
    client_ip = request.remote_addr
    if not protector.is_valid_ip(client_ip, db):
        return Response("Forbidden: Invalid IP Address", status=403)


@app.before_request
def filter_xss_sql_injection():
    """Sanitize all incoming data to prevent XSS and SQL injection."""
    if request.data:
        rdata = request.data.decode("utf-8")
        rdata = json.loads(rdata)
        if isinstance(rdata, dict):
            for k, v in rdata.items():
                rdata[k] = protector.sanitize_input(v)
        elif isinstance(rdata, str):
            rdata = protector.sanitize_input(rdata)

        json_data = json.dumps(rdata)
        request._cached_data = json_data.encode("utf-8")
        request.data = json_data.encode("utf-8")
        print(request.data)
    if request.args:
        sanitized_args = {
            k: protector.sanitize_input(v) for k, v in request.args.items()
        }
        request.args = sanitized_args
    if request.form:
        sanitized_form = {
            k: protector.sanitize_input(v) for k, v in request.form.items()
        }
        request.form = sanitized_form


@app.before_request
def filter_ip():
    """Filter out requests from blocked IPs."""
    client_ip = request.remote_addr
    if not_found_limiter.find_not_found_limited(client_ip):
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

    target_url = f"{SERVER_URL}/{url}"  # Forward to Node.js server running on port 5173

    disabled_endpoints = endpoints.find({"enabled": False})
    matcher = URLMatcher(list(disabled_endpoints))
    if matcher.checkMatch(url, request.method):
        return Response("This endpoint is disabled.", status=403)

    try:
        if request.data:
            data_to_send = request.data
        else:
            data_to_send = request.form

        match request.method:
            case "GET":
                logging.info(f"GET request to {target_url} from IP: {client_ip}")
                resp = requests.get(
                    target_url,
                    headers={
                        key: value for key, value in request.headers if key != "Host"
                    },
                )
            case "POST":
                logging.info(f"POST request to {target_url} from IP: {client_ip}")
                resp = requests.post(
                    target_url,
                    data=data_to_send,
                    headers={
                        key: value for key, value in request.headers if key != "Host"
                    },
                )
            case "PUT":
                logging.info(f"PUT request to {target_url} from IP: {client_ip}")
                resp = requests.put(
                    target_url,
                    data=data_to_send,
                    headers={
                        key: value for key, value in request.headers if key != "Host"
                    },
                )
            case "DELETE":
                logging.info(f"DELETE request to {target_url} from IP: {client_ip}")
                resp = requests.delete(
                    target_url,
                    headers={
                        key: value for key, value in request.headers if key != "Host"
                    },
                )
            case _:
                return Response("Method not allowed", status=405)
    except requests.RequestException as e:
        logging.error(f"Error during request to {target_url}: {e}")
        return Response(f"An error occurred", status=500)

    if resp.status_code == 404:
        if not_found_limiter.add_not_found_limited(client_ip):
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
