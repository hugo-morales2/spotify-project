import requests
import urllib.parse
from spotify_auth import *

from datetime import datetime, timedelta
from flask import Flask, redirect, request, jsonify, session, render_template, make_response


app = Flask(__name__)
app.secret_key = 'bruhington'

CLIENT_ID = '1666cec95dcd42e1ae814080e42eab8f'
CLIENT_SECRET = '129a299f625c4f4dae70e5a4294500cc'
REDIRECT_URI = 'http://localhost:5000/callback'

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

# The base
# @app.route('/')
# def index():
#     print(" ")

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    

@app.route('/')
def client_auth():

    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()


    token_info = get_access_token_client()


    return _corsify_actual_response(jsonify({'data': token_info}))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)