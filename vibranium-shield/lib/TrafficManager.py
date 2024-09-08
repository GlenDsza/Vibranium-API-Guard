import time
from pymongo.collection import Collection
import requests


class TrafficManager:

    collection: Collection

    def __init__(self, collection):
        self.collection = collection

    def geo_ip_lookup(self, ip) -> dict | None:
        resp = requests.get("http://ip-api.com/json/{ip}".format(ip=ip))
        if resp.status_code == 200 and resp.json()["status"] == "success":
            json_resp = resp.json()
            return {
                "country": json_resp["country"],
                "region": json_resp["regionName"],
                "city": json_resp["city"],
                "lat": json_resp["lat"],
                "long": json_resp["lon"],
            }
        else:
            return None

    def log_traffic(self, request, response):

        geo_location = self.geo_ip_lookup(request.remote_addr)

        # Build the traffic log data
        traffic_data = {
            "ip": request.remote_addr,
            "url": request.url,
            "method": request.method,
            "statusCode": response.status_code,
            "requestHeaders": dict(request.headers),
            "responseHeaders": dict(response.headers),
            "userAgent": request.headers.get("User-Agent"),
            "referrer": request.referrer,
            "body": (
                request.get_data(as_text=True)
                if request.method in ["POST", "PUT", "PATCH"]
                else None
            ),
            "createdAt": time.strftime(
                "%Y-%m-%dT%H:%M:%SZ", time.gmtime()
            ),  # UTC timestamp
            "geoLocation": geo_location,
        }

        # Insert the traffic data into MongoDB
        self.collection.insert_one(traffic_data)
