import requests
import urllib.parse
from spotify_auth import *

from datetime import datetime, timedelta
from flask import Flask, redirect, request, jsonify, session, render_template


app = Flask(__name__)
app.secret_key = 'bruhington'

CLIENT_ID = '1666cec95dcd42e1ae814080e42eab8f'
CLIENT_SECRET = '129a299f625c4f4dae70e5a4294500cc'
REDIRECT_URI = 'http://localhost:5000/callback'

AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

# The base
@app.route('/')
def index():
    if 'access_token' not in session:
        return render_template("welcome.html")
    else:
        if datetime.now().timestamp() >= session['expires_at']:
            return redirect('/refresh-token')
        
        return render_template("index.html")
    




# LOGIN IF NOT LOGGED IN
@app.route('/login')
def login():
    scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'
    #scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'

    params = {
        'client_id' : CLIENT_ID,
        'response_type' : 'code',
        'scope' : scope,
        'redirect_uri' : REDIRECT_URI,

        #can disable
        #'show_dialog' : True
    }

    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"

    return redirect(auth_url)

@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({"error": request.args['error']})
    
    if 'code' in request.args:

        token_info = get_access_token(request.args['code'])

        # This gives these:
        # Access token, request token, and expires in
        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
        # this is used to check when the access token has expired, so we can get a new one
        return redirect('/SongAdd')

@app.route('/playlists')
def det_playlists():
    

    if 'access_token' not in session:
        return redirect('/login')

    if datetime.now().timestamp() >= session['expires_at']:
        return redirect('/refresh-token')
    
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }

    response = requests.get(API_BASE_URL + 'me/playlists', headers=headers)
    playlists = response.json()

    playlists["items"][0]

    return jsonify(playlists)


#ADD SONG BY NAME AND ARTIST
@app.route('/add-song', methods=['POST'])
def add_song_to_playlist():
    if 'access_token' not in session:
        return jsonify({"error": "User not logged in"})

    if datetime.now().timestamp() >= session['expires_at']:
        return redirect('/refresh-token')

    # HARD CODED - you should get this dynamically and pass it as an argument to the function in the future
    playlist_id = '69DSRg2gpP7vCG7Yem574j'

    # Extract the track details from the request
    data = request.json
    track_name = data.get('track_name')
    artist_name = data.get('artist_name')

    # Search for the track
    search_params = {
        'q': f'{track_name} artist:{artist_name}',
        'type': 'track',
        'limit': 1
    }
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }
    response = requests.get(API_BASE_URL + 'search', params=search_params, headers=headers)
    search_results = response.json()

    # found the track
    if 'tracks' in search_results and 'items' in search_results['tracks'] and len(search_results['tracks']['items']) > 0:
        # Extract the track ID
        track_id = search_results['tracks']['items'][0]['id']

        # Add the track to the playlist
        add_track_params = {
            'uris': [f'spotify:track:{track_id}']
        }
        response = requests.post(API_BASE_URL + f'playlists/{playlist_id}/tracks', json=add_track_params, headers=headers)
        # success or fail
        if response.status_code == 201 or response.status_code == 200:
            return jsonify({"success": "Track added to playlist successfully"})
        else:
            return jsonify({"error": "Failed to add track to playlist. Error code: " + str(response.status_code)})
    else:
        return jsonify({"error": "Track not found"})
    


# ADD SONG BY ID    
@app.route('/add-song-by-id', methods=['POST'])
def add_song_to_playlist_by_id():
    if 'access_token' not in session:
        return jsonify({"error": "User not logged in"})

    if datetime.now().timestamp() >= session['expires_at']:
        return redirect('/refresh-token')

    # HARD CODED - you should get this dynamically and pass it as an argument to the function in the future
    playlist_id = '69DSRg2gpP7vCG7Yem574j'

    # Extract the track details from the request
    data = request.json
    
        # Extract the track ID
    track_id = data.get('track_id')

    # Add the track to the playlist
    add_track_params = {
        'uris': [f'spotify:track:{track_id}']
    }
    
    headers = {
        'Authorization': f"Bearer {session['access_token']}"
    }
    response = requests.post(API_BASE_URL + f'playlists/{playlist_id}/tracks', json=add_track_params, headers=headers)
    if response.status_code == 201 or response.status_code == 200:
        return jsonify({"success": "Track added to playlist successfully"})
    else:
        return jsonify({"error": "Failed to add track to playlist. Error code: " + str(response.status_code)})

@app.route('/refresh-token')
def refresh_token():
    # check if we have a login, else re-login
    if 'refresh_token' not in session:
        return redirect('/login')
    
    if datetime.now().timestamp() >= session['expires_at']:

        new_token_info = refresh_access_token(session['refresh_token'])

        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']

        return redirect('/playlists')
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)