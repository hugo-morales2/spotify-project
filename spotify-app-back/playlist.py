# @app.route('/add-song-by-id', methods=['POST'])
# def add_song_to_playlist():
#     if 'access_token' not in session:
#         return jsonify({"error": "User not logged in"})

#     if datetime.now().timestamp() >= session['expires_at']:
#         return redirect('/refresh-token')

#     # HARD CODED - you should get this dynamically and pass it as an argument to the function in the future
#     playlist_id = '69DSRg2gpP7vCG7Yem574j'

#     # Extract the track details from the request
#     data = request.json
    
#         # Extract the track ID
#     track_id = data.get('track_id')

#     # Add the track to the playlist
#     add_track_params = {
#         'uris': [f'spotify:track:{track_id}']
#     }
#     response = requests.post(API_BASE_URL + f'playlists/{playlist_id}/tracks', json=add_track_params, headers=headers)
#     if response.status_code == 201 or response.status_code == 200:
#         return jsonify({"success": "Track added to playlist successfully"})
#     else:
#         return jsonify({"error": "Failed to add track to playlist. Error code: " + str(response.status_code)})
