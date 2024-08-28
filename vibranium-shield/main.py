from flask import Flask, request, Response
import requests

app = Flask(__name__)

@app.route('/', defaults={'url': ''}, methods=['GET', 'POST'])
@app.route('/<path:url>', methods=['GET', 'POST'])
def proxy(url):
    target_url = f'http://localhost:5173/{url}'  # Forward to Node.js server running on port 3000
    if request.method == 'GET':
        resp = requests.get(target_url)
    else:
        resp = requests.post(target_url, data=request.form)
    if resp.status_code == 404:
        return 'Not found', 404
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response

if __name__ == '__main__':
    app.run(port=80)  # Proxy server listens on port 8080
