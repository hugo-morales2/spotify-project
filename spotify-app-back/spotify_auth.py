import requests
from datetime import datetime

# this is the code that gets the new access codes, whether it be a new one or just refreshing it

CLIENT_ID = '1666cec95dcd42e1ae814080e42eab8f'
CLIENT_SECRET = '129a299f625c4f4dae70e5a4294500cc'
REDIRECT_URI = 'http://localhost:5000/callback'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

def get_access_token(code):
    req_body = {
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri' : REDIRECT_URI,
        'client_id' : CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }

    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()

    return token_info

def refresh_access_token(refresh_token):
    req_body = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }

    response = requests.post(TOKEN_URL, data=req_body)
    new_token_info = response.json()

    return new_token_info




#-d "grant_type=client_credentials&client_id=1666cec95dcd42e1ae814080e42eab8f&client_secret=129a299f625c4f4dae70e5a4294500cc"

def get_access_token_client():
    req_body = {
        'grant_type': 'client_credentials',
        'client_id' : CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }

    response = requests.post(TOKEN_URL, data=req_body)
    token_info = response.json()

    return token_info