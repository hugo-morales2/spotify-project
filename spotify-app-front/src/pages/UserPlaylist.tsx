import PageButton from "../components/PageButton";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PlaylistData, Playlist, Tracks } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { AuthContext } from "../utils/AuthContext";

const UserPlaylist = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  const [trackData, setTrackData] = useState<Tracks[]>();

  // should put this in the context
  const userDisplayName = localStorage.getItem("display_name");

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();

  const userID = localStorage.getItem("userID");

  function handleAddSong() {
    navigate("/SongAdd", { state: { setAlbum: selectedPlaylist } });
  }

  function playlistSelection(event: any) {
    const access = "Bearer " + accessToken;

    for (let i = 0; i < playlistData.length; i++) {
      if (playlistData[i].id == event.target.value) {
        fetch(playlistData[i].tracks.href, {
          headers: {
            Authorization: access,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            var trackList: Tracks[] = [];
            for (let i = 0; i < response.items.length; i++) {
              trackList.push(response.items[i].track);
            }
            setTrackData(trackList);
          });
        setSelectedPlaylist(playlistData[i]);
      }
    }
    //setSelectedPlaylist(event.target);
  }

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data.items);
  }

  useEffect(() => {
    if (!accessToken) return;

    const access = "Bearer " + accessToken;

    // get the user's playlists
    fetch(API_BASE_URL + "users/" + userID + "/playlists", {
      headers: {
        Authorization: access,
      },
    })
      .then((response) => {
        console.log(
          `Received response from ${
            API_BASE_URL + "users/" + userID + "/playlists"
          }`
        );
        return response.json();
      })
      .then((response) => handlePlaylistData(response));

    // });
  }, [accessToken]);

  return (
    <>
      <div>
        <PageButton name="Home" link="/PageSelect" />
      </div>
      <h1 className="mb-6"> {userDisplayName}'s Playlists: </h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {playlistData.map((playlist, index) => (
          <button
            // change this to the alternate styles
            className="bg-gray-600 p-3 rounded-md hover:bg-gray-500 focus:bg-slate-700"
            value={playlist.id}
            key={index}
            onClick={(e) => playlistSelection(e)}
          >
            {playlist.name}
          </button>
        ))}
      </div>
      {trackData != undefined && (
        <div className="mt-10 mx-auto p-5 w-2/3 bg-gray-400 rounded-lg">
          {trackData != undefined &&
            trackData.length != 0 &&
            trackData?.map((track, index) => (
              <div key={index}>
                {track.name} - {track.artists[0].name}
              </div>
            ))}
          {trackData != undefined && (
            <button
              onClick={() => handleAddSong()}
              className="bg-gray-500 py-3 px-5 mt-4 rounded-full hover:bg-gray-600 focus:bg-slate-700"
            >
              Add Song to this playlist!
            </button>
          )}
          {trackData != undefined && trackData.length == 0 && (
            <div>This playlist is empty!</div>
          )}
        </div>
      )}
    </>
  );
};

export default UserPlaylist;
